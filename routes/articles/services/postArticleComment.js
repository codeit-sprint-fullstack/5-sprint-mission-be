import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { articleIdParamValidation } from "../../../validation/paramValidation.js";
import { createCommentValidation } from "../../../validation/commentValidation.js";

const prisma = new PrismaClient();

// 게시판 댓글 등록 API
const postArticleComment = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.articleId, articleIdParamValidation);
  const articleId = req.params.articleId;
  const targetId = articleId;
  const targetType = "ARTICLE";

  // error: 입력 값 유효성 검증(400)
  assert(req.body, createCommentValidation);
  const { content } = req.body;

  // create
  const result = await prisma.comment.create({
    data: {
      targetId,
      targetType,
      content,
    },
  });
  res.status(201).send({ message: "댓글이 등록되었습니다.", data: result });
});

export default postArticleComment;
