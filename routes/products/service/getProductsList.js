import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../utils/asyncHandler.js";
import { assert } from "superstruct";
import { queryValidation } from "../../../structs.js";
import { createError } from "../../../utils/errorHandler.js";

const prisma = new PrismaClient();

// 물품 목록 조회 API

const getProductsList = asyncHandler(async (req, res) => {
  // error: query 형식 맞지 않음(400)
  assert(queryValidation, req.query);
  const { sort, offset, limit, keyword } = req.query;

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
          { name: { contain: keyword, mode: "insensitive" } },
          { description: { contain: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  // findMany
  const result = await prisma.product.findMany({
    where,
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  });

  // error: 상품 없음(404)
  if (!result) return createError("상품이 존재하지 않습니다.", 404);

  res.send({ message: "상품 목록 조회 결과입니다.", data: result });
});

export default getProductsList;
