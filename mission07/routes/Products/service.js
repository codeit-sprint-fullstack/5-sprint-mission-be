import asyncHandler from "../asyncHandler.js";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "../../structs.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProductList = asyncHandler(async (req, res) => {
  const { page, pageSize, orderBy, keyword = "" } = req.query;

  // 검색어 설정
  let searchCondition = {};
  if (keyword !== "") {
    searchCondition = {
      name: {
        contains: keyword, // keyword 포함
        mode: "insensitive", // 대소문자 구분하지 않음
      },
    };
  }

  // 정렬 기준 설정
  let sortCondition = {};
  switch (orderBy) {
    case "favorite":
      sortCondition = { favoriteCount: "desc" };
      break;
    case "recent":
    default:
      sortCondition = { createdAt: "desc" };
  }

  // 전체 상품 개수 조회
  const totalCountPromise = prisma.product.count({ where: searchCondition });

  // 상품 조회
  const productListPromise = prisma.product.findMany({
    where: searchCondition,
    orderBy: sortCondition,
    skip: (+page - 1) * +pageSize,
    take: +pageSize,
  });

  // $transaction을 사용해 두 쿼리 병렬 실행
  const [totalCount, productList] = await prisma.$transaction([
    totalCountPromise,
    productListPromise,
  ]);

  res.status(200).send({ list: productList || [], totalCount });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  res.send(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  assert(req.body, CreateProduct);
  const { tags, ...data } = req.body;
  const userId = req.data.id;

  // create product
  const product = await prisma.product.create({
    data: { ...data, userId },
  });

  // create tags
  const tagsId = [];

  if (tags.length > 0) {
    for (const tag of tags) {
      // tag 있는지 판별
      let tagObj = await prisma.tag.findFirst({
        where: { name: tag },
      });

      // tag 없으면 생성
      if (!tagObj) {
        tagObj = await prisma.tag.create({
          data: { name: tag },
        });
      }

      tagsId.push(tagObj.id); // tagId 추가
    }

    // create productTags
    for (const tagId of tagsId) {
      await prisma.productTag.create({
        data: {
          productId: product.id,
          tagId,
        },
      });
    }
  }

  res.status(201).send(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  assert(req.body, PatchProduct);
  const { tags, ...data } = req.body;
  const id = req.params.id;

  // update products
  const product = await prisma.product.update({
    where: { id },
    data,
  });

  // update productTags
  // [가, 나, 다] => [가, 나, 다, 라] // 추가된 부분 찾기
  // [가, 나, 다] => [가, 다] // 삭제된 부분 찾기
  const prevProductTags = await prisma.productTag.findMany({
    where: { productId: id },
  });
  const prevTagIds = prevProductTags.map((productTag) => productTag.tagId);
  const nextTagIds = [];

  // update tags
  for (const tag of tags) {
    const newTag = await prisma.tag.findUnique({
      where: { name: tag },
    });

    if (!newTag) {
      await prisma.tag.create({
        data: { name: tag },
      });
    }

    nextTagIds.push(newTag.id);
  }

  // 추가된 부분 찾기
  const tagsToAdd = nextTagIds.filter((tagId) => !prevTagIds.includes(tagId));
  // 삭제된 부분 찾기
  const tagsToRemove = prevTagIds.filter(
    (tagId) => !nextTagIds.includes(tagId)
  );

  await prisma.$transaction([
    // 새로운 태그 추가
    prisma.productTag.createMany({
      data: tagsToAdd.map((tagId) => ({
        productId: id,
        tagId,
      })),
    }),
    // 제거할 태그 삭제
    prisma.productTag.deleteMany({
      where: {
        productId: id,
        tagId: {
          in: tagsToRemove,
        },
      },
    }),
  ]);

  res.status(203).send(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // tagId backup
  const deletedTagIds = await prisma.productTag.findMany({
    where: { productId: id },
    select: { tagId: true },
  });

  // product 삭제
  await prisma.product.delete({
    where: { id },
  });

  // productTag 삭제
  // productTag 삭제되었으니, productTag에서 다른 product의 tagId가 없으면 tag 삭제
  // 안되면 롤백
  for (const deletedTagId of deletedTagIds) {
    const tag = await prisma.productTag.findMany({
      where: { id: deletedTagId.tagId },
    });

    if (!tag) {
      await prisma.tag.delete({
        where: { id: deletedTagId.tagId },
      });
    }
  }

  res.sendStatus(204);
});
