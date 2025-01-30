import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../middlewares/asyncHandler.js";
import { assert } from "superstruct";
import { createArticleValidation } from "../../../validation/articleValidation.js";

const prisma = new PrismaClient();

// 게시물 등록 API
const postNewArticle = asyncHandler(async (req, res) => {
  // error: 입력 값 유효성 검증(400)
  assert(req.body, createArticleValidation);

  // create
  const { title, content, images = [] } = req.body;
  const result = await prisma.article.create({
    data: {
      title,
      content,
      images,
    },
  });
  res.status(201).send({ message: "게시물이 등록되었습니다.", data: result });
});

export default postNewArticle;
