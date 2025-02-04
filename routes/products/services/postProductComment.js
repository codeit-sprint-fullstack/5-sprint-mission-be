import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { productIdParamValidation } from "../../../validation/paramValidation.js";
import { createCommentValidation } from "../../../validation/commentValidation.js";

const prisma = new PrismaClient();

// 게시판 댓글 등록 API
const postProductComment = asyncHandler(async (req, res) => {
  // error: id 형식 오류(400)
  assert(req.params.productId, productIdParamValidation);
  const productId = req.params.productId;
  const targetId = productId;
  const targetType = "PRODUCT";

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

export default postProductComment;
