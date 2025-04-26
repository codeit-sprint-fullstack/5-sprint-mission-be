import { Request, Response, NextFunction } from "express";
import multer from "multer";
import prisma from "../config/prismaClient";
import { Prisma } from "@prisma/client";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(null, false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
  },
});

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cursor, take = 10, keyword = "createdAt" } = req.query;
    const rawSearch = req.query.search;
    const searchValue = typeof rawSearch === "string" ? rawSearch : "";
    const limit = Number(take);

    let orderByCondition:
      | Prisma.ArticleOrderByWithRelationInput
      | Prisma.ArticleOrderByWithRelationInput[] = { createdAt: "desc" };
    if (keyword === "favorites") {
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
      take: limit + 1,
      cursor: cursor ? { id: String(cursor) } : undefined,
      orderBy: orderByCondition,
      where: whereCondition,
      include: {
        _count: {
          select: { favorites: true },
        },
      },
    });

    let nextCursor: string | null = null;
    if (articles.length > limit) {
      nextCursor = articles.pop()?.id || null;
    }

    res.status(200).json({ success: true, articles, nextCursor });
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

    const { title, content } = req.body;
    const imageUrls = Array.isArray(req.files)
      ? req.files.map(
          (file: Express.Multer.File) =>
            `/uploads/${encodeURIComponent(file.filename)}`
        )
      : [];

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
    const { title, content } = req.body;
    const newImages = Array.isArray(req.files)
      ? req.files.map(
          (file: Express.Multer.File) =>
            `/uploads/${encodeURIComponent(file.filename)}`
        )
      : [];

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
        imageUrls: newImages.length ? newImages : article.imageUrls,
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
