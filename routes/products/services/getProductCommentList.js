import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { productIdParamValidation } from "../../../validation/paramValidation.js";
import { commentListQueryValidation } from "../../../validation/queryValidation.js";
const prisma = new PrismaClient();

// 상품 댓글 목록 조회 API
const getProductCommentList = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.productId, productIdParamValidation);
  const productId = req.params.productId;

  const parsedQuery = {
    cursor: req.query.cursor, // 마지막으로 조회한 댓글의 ID(uuid)
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  };

  // error: query 형식 맞지 않음(400)
  assert(parsedQuery, commentListQueryValidation);
  const { cursor, limit = 10 } = parsedQuery;

  // findMany
  const result = await prisma.comment.findMany({
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "asc" },
    where: { targetId: productId, targetType: "PRODUCT" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  // nextCursor 계산
  const nextCursor =
    result.length === limit ? result[result.length - 1].id : null;

  res.send({ message: "댓글 목록 조회 결과입니다.", data: result, nextCursor });
});

export default getProductCommentList;
