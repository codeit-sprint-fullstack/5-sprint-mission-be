import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId, productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next({ status: 401, message: "로그인이 필요합니다." });
    }

    if (!articleId && !productId) {
      return next({
        status: 400,
        message: "articleId 또는 productId가 필요합니다.",
      });
    }

    await prisma.$transaction(async (tx) => {
      if (articleId) {
        const exists = await tx.articleFavorite.findUnique({
          where: { userId_articleId: { userId, articleId } },
        });

        if (exists) {
          throw { status: 400, message: "이미 좋아요를 눌렀습니다." };
        }

        await tx.articleFavorite.create({ data: { userId, articleId } });
      }

      if (productId) {
        const exists = await tx.productFavorite.findUnique({
          where: { userId_productId: { userId, productId } },
        });

        if (exists) {
          throw { status: 400, message: "이미 좋아요를 눌렀습니다." };
        }

        await tx.productFavorite.create({ data: { userId, productId } });
      }
    });

    res.status(201).json({ isLike: true, message: "좋아요가 추가되었습니다." });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId, productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next({ status: 401, message: "로그인이 필요합니다." });
    }

    if (!articleId && !productId) {
      return next({
        status: 400,
        message: "articleId 또는 productId가 필요합니다.",
      });
    }

    await prisma.$transaction(async (tx) => {
      if (articleId) {
        const favorite = await tx.articleFavorite.findFirst({
          where: { userId, articleId },
        });

        if (!favorite) {
          throw { status: 404, message: "이미 좋아요가 취소되었습니다." };
        }

        await tx.articleFavorite.delete({ where: { id: favorite.id } });
      }

      if (productId) {
        const favorite = await tx.productFavorite.findFirst({
          where: { userId, productId },
        });

        if (!favorite) {
          throw { status: 404, message: "이미 좋아요가 취소되었습니다." };
        }

        await tx.productFavorite.delete({ where: { id: favorite.id } });
      }
    });

    res
      .status(200)
      .json({ isLike: false, message: "좋아요가 취소되었습니다." });
  } catch (err) {
    next(err);
  }
};
