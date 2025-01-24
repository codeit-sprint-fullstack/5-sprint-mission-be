import asyncHandler from "../asyncHandler.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createArticleLikes = asyncHandler(async (req, res) => {
  const { userId } = req.data.id;
  const { articleId } = req.body;

  // 좋아요 생성
  await prisma.articleLikes.create({ userId, articleId });
  res.status(201).send({ message: "좋아요 생성 성공" });
});

export const deleteArticleLikes = asyncHandler(async (req, res) => {
  const { userId } = req.data.id;
  const { articleId } = req.body;

  // 좋아요 삭제
  await prisma.articleLikes.delete({ where: { userId, articleId } });
  res.status(204).send({ message: "좋아요 삭제 성공" });
});
