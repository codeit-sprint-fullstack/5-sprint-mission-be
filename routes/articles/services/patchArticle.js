import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { updateArticleValidation } from "../../../validation/articleValidation.js";
import { articleIdParamValidation } from "../../../validation/paramValidation.js";
import { assert } from "superstruct";
import { createError } from "../../../middlewares/errorHandler.js";

const prisma = new PrismaClient();

// 게시글 수정 API - 특정 게시글 조회 후 수정
const patchArticle = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.id, articleIdParamValidation);
  const id = req.params.id;

  const currentArticle = await prisma.article.findUnique({ where: { id } });
  // error: 게시글 없음(404)
  if (!currentArticle) throw createError("게시글이 존재하지 않습니다.", 404);

  // error: 유효성 검사(400)
  assert(req.body, updateArticleValidation);

  // update
  const result = await prisma.article.update({
    where: { id },
    data: req.body,
  });

  res
    .status(201)
    .send({ message: "게시글 정보가 수정되었습니다.", data: result });
});

export default patchArticle;
