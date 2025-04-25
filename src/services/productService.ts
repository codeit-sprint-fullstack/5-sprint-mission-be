import prisma from "@/config/database";
import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { Product } from "@/generated/prisma";
import {
  GetProductListDto,
  ProductPostAndPatchDto,
  ProductWithOwner,
  ProductWithOwnerAndIsFavorite,
  ProductWithTotalCount,
} from "@/models/product";
import { SuccessResponse } from "@/types/response";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function getProductList(
  getProductListInput: GetProductListDto
): Promise<SuccessResponse<ProductWithTotalCount>> {
  let orderOption = {};
  switch (getProductListInput.orderBy) {
    case "recent":
      orderOption = { createdAt: "desc" };
      break;
    case "favorite":
      orderOption = { likeCount: "desc" };
      break;
    default:
      orderOption = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: getProductListInput.keyword,
          },
        },
        {
          description: {
            contains: getProductListInput.keyword,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      price: true,
      favoriteCount: true,
      images: true,
      owner: {
        select: {
          nickname: true,
          profileImg: true,
        },
      },
    },
    orderBy: orderOption,
    skip: (getProductListInput.page - 1) * getProductListInput.pageSize,
    take: getProductListInput.pageSize,
  });

  const totalCount = await prisma.product.count({
    where: {
      OR: [
        {
          name: {
            contains: getProductListInput.keyword,
          },
        },
        {
          description: {
            contains: getProductListInput.keyword,
          },
        },
      ],
    },
  });

  return createSuccessResponse<ProductWithTotalCount>(
    { products, totalCount },
    "상품 리스트 조회에 성공했습니다."
  );
}

async function getProductById(
  id: number,
  userId?: number
): Promise<SuccessResponse<ProductWithOwner>> {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          nickname: true,
          profileImg: true,
        },
      },
    },
  });

  if (!product) throw new BadRequestException("존재하지 않는 상품입니다.");
  if (!userId) {
    return createSuccessResponse<ProductWithOwner>(
      product,
      "상품 조회에 성공했습니다."
    );
  }

  const favorite = await prisma.favorite.findFirst({
    where: {
      productId: id,
      userId,
    },
  });

  let isFavorite: boolean;
  if(favorite){
    isFavorite = true;
  } else {
    isFavorite = false;
  }

  const productWithIsFavorite = { ...product, isFavorite };
  return createSuccessResponse<ProductWithOwnerAndIsFavorite>(
    productWithIsFavorite,
    "상품 조회에 성공했습니다."
  );
}

async function postProduct(
  postAndPatchInput: ProductPostAndPatchDto
): Promise<SuccessResponse<Product>> {
  const newProduct = await prisma.product.create({
    data: {
      name: postAndPatchInput.name,
      description: postAndPatchInput.description,
      price: postAndPatchInput.price,
      tags: postAndPatchInput.tags,
      ownerId: postAndPatchInput.ownerId,
    },
  });

  return createSuccessResponse<Product>(
    newProduct,
    "상품 생성에 성공하였습니다."
  );
}

async function patchProduct(
  id: number,
  postAndPatchInput: ProductPostAndPatchDto
): Promise<SuccessResponse<Product>> {
  const updatedProduct = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: postAndPatchInput.name,
      description: postAndPatchInput.description,
      price: postAndPatchInput.price,
      tags: postAndPatchInput.tags,
      ownerId: postAndPatchInput.ownerId,
    },
  });

  return createSuccessResponse<Product>(
    updatedProduct,
    "상품 수정에 성공하였습니다."
  );
}

async function deleteProduct(id: number): Promise<SuccessResponse<null>> {
  await prisma.product.delete({
    where: {
      id,
    },
  });

  return createSuccessResponse<null>(null, "상품이 삭제되었습니다!");
}

const productService = {
  getProductList,
  getProductById,
  postProduct,
  patchProduct,
  deleteProduct,
};

export default productService;
