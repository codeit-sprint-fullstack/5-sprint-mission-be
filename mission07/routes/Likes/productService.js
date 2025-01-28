import asyncHandler from "../asyncHandler.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createProductLikes = asyncHandler(async (req, res) => {
  const { userId } = req.data.id;
  const { productId } = req.body;

  // 좋아요 생성
  await prisma.productLikes.create({ userId, productId });
  res.status(201).send({ message: "좋아요 생성 성공" });
});

export const deleteProductLikes = asyncHandler(async (req, res) => {
  const { userId } = req.data.id;
  const { productId } = req.body;

  // 좋아요 삭제
  await prisma.productLikes.delete({ where: { userId, productId } });
  res.status(204).send({ message: "좋아요 삭제 성공" });
});
