import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { articleIdParamValidation } from "../../../validation/paramValidation.js";
import { createError } from "../../../middlewares/errorHandler.js";

const prisma = new PrismaClient();

// 상품 상세 조회 API - 상품 클릭하면 해당 상품 상세 조회
const getArticleById = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.id, articleIdParamValidation);
  const id = req.params.id;

  // findUnique
  const result = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  // error: 상품 없음(404)
  if (!result) throw createError("게시글이 존재하지 않습니다.", 404);

  res.status(200).send({ message: "게시글 조회 결과입니다.", data: result });
});

export default getArticleById;
