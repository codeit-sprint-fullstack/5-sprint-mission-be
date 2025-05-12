import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";
import { Prisma } from "@prisma/client";

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, take = 10, sortBy = "createdAt" } = req.query;
    const rawSearch = req.query.search;
    const searchValue = typeof rawSearch === "string" ? rawSearch : "";

    const currentPage = Number(page);
    const limit = Number(take);

    let orderByCondition:
      | Prisma.ArticleOrderByWithRelationInput
      | Prisma.ArticleOrderByWithRelationInput[] = { createdAt: "desc" };

    if (sortBy === "favorites") {
      orderByCondition = [
        { favorites: { _count: "desc" } },
        { createdAt: "desc" },
      ];
    }

    const whereCondition =
      searchValue.length > 0
        ? {
            OR: [
              {
                title: {
                  contains: searchValue,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                content: {
                  contains: searchValue,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : undefined;

    const articles = await prisma.article.findMany({
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: orderByCondition,
      where: whereCondition,
      include: {
        _count: {
          select: { favorites: true },
        },
        favorites: req.user
          ? { where: { userId: req.user.id }, select: { id: true } }
          : undefined,
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    const result = articles.map((article) => {
      const isLiked =
        Array.isArray(article.favorites) && article.favorites.length > 0;
      const favoriteCount = article._count?.favorites || 0;
      const { favorites, _count, ...rest } = article;

      return {
        ...rest,
        isLiked,
        favoriteCount,
      };
    });

    const totalCount = await prisma.article.count({
      where: whereCondition,
    });

    res.status(200).json({
      success: true,
      articles: result,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
};

export const getArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        imageUrls: true,
        _count: { select: { favorites: true } },
        favorites: userId
          ? { where: { userId }, select: { id: true } }
          : undefined,
        comments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { id: true, nickname: true } },
          },
        },
      },
    });

    if (!article)
      return next({ status: 404, message: "게시글을 찾을 수 없습니다." });

    const isLiked =
      Array.isArray(article.favorites) && article.favorites.length > 0;
    const favoriteCount = article._count.favorites;
    const { favorites, _count, ...rest } = article;

    res.status(200).json({ ...rest, isLiked, favoriteCount });
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      return next({ status: 401, message: "로그인이 필요합니다." });

    const { title, content, imageUrls } = req.body;

    if (!title || !content) {
      return next({ status: 400, message: "제목과 내용을 모두 입력해주세요." });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        imageUrls,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (err) {
    next(err);
  }
};

export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrls } = req.body;

    if (!title || !content) {
      return next({ status: 400, message: "제목과 내용을 모두 입력해주세요." });
    }

    if (!Array.isArray(imageUrls) || imageUrls.length > 3) {
      return next({
        status: 400,
        message: "이미지 URL은 최대 3개까지 등록 가능합니다.",
      });
    }

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article)
      return next({ status: 404, message: "게시글을 찾을 수 없습니다." });
    if (article.userId !== req.user?.id)
      return next({ status: 403, message: "권한이 없습니다." });

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        imageUrls,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article)
      return next({ status: 404, message: "게시글을 찾을 수 없습니다." });
    if (article.userId !== req.user?.id)
      return next({ status: 403, message: "권한이 없습니다." });

    await prisma.article.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
