import { PrismaClient } from "@prisma/client";
import { createError } from "../../../middlewares/errorHandler.js";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { articleIdParamValidation } from "../../../validation/paramValidation.js";
import { commentIdParamValidation } from "../../../validation/paramValidation.js";

const prisma = new PrismaClient();

// 댓글 삭제 API
const deleteArticleComment = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.articleId, articleIdParamValidation);
  assert(req.params.commentId, commentIdParamValidation);
  const commentId = req.params.commentId;

  // delete
  const result = await prisma.comment.delete({
    where: { commentId },
  });

  // error: 댓글 없음(404)
  if (!result) throw createError("댓글이 존재하지 않습니다.", 404);

  res
    .status(200) // 메시지 반환하려고 204 대신 200씀
    .send({ message: "댓글이 성공적으로 삭제되었습니다.", data: result });
});

export default deleteArticleComment;
