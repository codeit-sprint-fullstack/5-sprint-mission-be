import { Prisma } from "@prisma/client";
import prisma from "../../prismaClient.js";

const addFavorite = async (productId: string, userId: number) => {
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      targetType: "product",
      targetId: productId,
      userId: userId,
    },
  });

  if (existingFavorite) return { status: 400, message: "이미 찜한 상품입니다." };
  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const favorite = await tx.favorite.create({
        data: { userId, targetId: productId, targetType: "product" },
      });
      const product = await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          favoriteCount: { increment: 1 },
        },
      });

      return { status: 200, favorite, product, isFavorite: true };
    }
  );
  return result;
};

const removeFavorite = async (productId: string, userId: number) => {
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      targetType: "product",
      targetId: productId,
      userId: userId,
    },
  });

  if (!existingFavorite) return { status: 400, message: "찜하지 않은 상품입니다." };
  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const favorite = await tx.favorite.delete({
        where: {
          id: existingFavorite.id,
        }
      });
      const product = await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          favoriteCount: { decrement: 1 },
        },
      });

      return { status: 200, favorite, product, isFavorite: false };
    }
  );
  return result;
};

const service = {
  addFavorite,
  removeFavorite,
};

export default service;
