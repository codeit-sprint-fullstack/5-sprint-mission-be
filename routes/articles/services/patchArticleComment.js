import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { articleIdParamValidation } from "../../../validation/paramValidation.js";
import { commentIdParamValidation } from "../../../validation/paramValidation.js";
import { createError } from "../../../middlewares/errorHandler.js";
import { updateCommentValidation } from "../../../validation/commentValidation.js";

const prisma = new PrismaClient();

// 상품 수정 API - 특정 상품 조회 후 수정
const patchArticleComment = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.articleId, articleIdParamValidation);
  assert(req.params.commentId, commentIdParamValidation);
  const commentId = req.params.commentId;

  // error: 댓글 없음(404)
  const currentComment = await prisma.comment.findUnique({
    where: { commentId },
  });
  if (!currentComment) throw createError("댓글이 존재하지 않습니다.", 404);

  // error: 유효성 검사(400)
  assert(req.body, updateCommentValidation);

  // update
  const result = await prisma.comment.update({
    where: { id },
    data: req.body,
  });

  res
    .status(201)
    .send({ message: "댓글 정보가 수정되었습니다.", data: result });
});

export default patchArticleComment;
