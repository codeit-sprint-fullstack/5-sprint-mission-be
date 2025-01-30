import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { productListQueryValidation } from "../../../validation/queryValidation.js";
import { createError } from "../../../middlewares/errorHandler.js";

const prisma = new PrismaClient();

// 물품 목록 조회 API

const getProductList = asyncHandler(async (req, res) => {
  const parsedQuery = {
    ...req.query,
    offset: req.query.offset ? Number(req.query.offset) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  };

  // error: query 형식 맞지 않음(400)
  assert(parsedQuery, productListQueryValidation);
  const { sort = "recent", offset = 0, limit = 10, keyword = "" } = parsedQuery;

  // 정렬 조건
  let orderBy;
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "favorite":
      orderBy = { favorite: "desc" };
      break;
  }

  // 검색 조건
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  // findMany
  const result = await prisma.product.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
  });

  // error: 상품 없음(404)
  if (!result) throw createError("상품이 존재하지 않습니다.", 404);

  res.send({ message: "상품 목록 조회 결과입니다.", data: result });
});

export default getProductList;
