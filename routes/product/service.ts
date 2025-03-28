import prisma from "../../prismaClient.js";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "../../structs.js";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

// 상품  리스트 조회
const getProductList = async (req: Request, res: Response) => {
  const { page = "1", pageSize = "10", order = "recent", keyword = "" } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  const keywordStr = (typeof keyword === "string" || Array.isArray(keyword)) ? keyword as string : "";

  if(isNaN(pageNum) || isNaN(pageSizeNum) || typeof order !== "string" || typeof keywordStr !== "string"){
    res.status(400).send({ message: "잘못 된 쿼리 값 입니다."});
    return;
  }

  let orderOption : Prisma.ProductOrderByWithRelationInput = {};
  switch (order) {
    case "recent":
      orderOption = { createdAt: "desc" };
      break;
    case "favorite":
      orderOption = { favoriteCount : "desc"}
      break;
  }

  const totalCount = await prisma.product.count({
    where: {
      OR: [
        {
          name: {
            contains: keywordStr,
          },
        },
        {
          description: {
            contains: keywordStr,
          },
        },
      ],
    },
  });

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: keywordStr,
          },
        },
        {
          description: {
            contains: keywordStr,
          },
        },
      ],
    },
    orderBy: orderOption,
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
  });
  res.status(200).send({ totalCount, list: products });
  return;
};

// 상품 등록
const postProduct = async (req: Request, res: Response) => {
  assert(req.body, CreateProduct);
  const ownerId = req.user?.id;
  const ownerNickname = req.user?.nickname;
  const newProduct = await prisma.product.create({
    data: {...req.body, ownerId, ownerNickname},
  });
  res.send(newProduct);
};

// 상품 단일 조회
const getProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;
  const favorite = await prisma.favorite.findFirst({
    where: {
      targetId: id,
      targetType: "product",
      userId: userId,
    }
  })
  const isFavorite = favorite? true:false;
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  res.send({...product, isFavorite});
  return;
};

// 상품 업데이트
const patchProduct = async (req: Request, res: Response) => {
  assert(req.body, PatchProduct);
  const id = req.params.id;

  const newProduct = await prisma.product.update({
    where: {
      id: id,
    },
    data: req.body,
  });
  res.send(newProduct);
};

// 상품 제거
const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await prisma.product.delete({
    where: {
      id: id,
    },
  });
  res.status(200).send({ message: "삭제 완료" });
};

const service = {
  getProductList,
  postProduct,
  getProduct,
  patchProduct,
  deleteProduct,
};
export default service;
