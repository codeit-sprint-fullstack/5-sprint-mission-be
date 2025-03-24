import multer from "multer";
import prisma from "../config/prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

export const getArticles = async (req, res, next) => {
  try {
    const { cursor, take = 10, keyword = "createdAt", search = "" } = req.query;
    const limit = Number(take);

    let orderByCondition = { createdAt: "desc" };
    if (keyword === "favorites") {
      orderByCondition = [
        { favorites: { _count: "desc" } },
        { createdAt: "desc" },
      ];
    }

    const whereCondition = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: orderByCondition,
      where: whereCondition,
      include: {
        _count: {
          select: { favorites: true },
        },
      },
    });

    let nextCursor = null;
    if (articles.length > limit) {
      nextCursor = articles.pop().id;
    }

    res.status(200).send({ success: true, articles, nextCursor });
  } catch (err) {
    next(err);
  }
};

export const getArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    console.log("getArticle userId", userId);

    const article = await prisma.article.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
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

    const { favorites, _count, ...response } = article;

    res.status(200).send({ ...response, isLiked, favoriteCount });
  } catch (err) {
    next(err);
  }
};

export const createArticle = [
  upload.array("image", 3),
  asyncHandler(async (req, res, next) => {
    try {
      if (!req.user)
        return next({ status: 401, message: "로그인이 필요합니다." });

      const { title, content } = req.body;
      const imageUrls = Array.isArray(req.files)
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const article = await prisma.article.create({
        data: { title, content, imageUrls, userId: req.user.id },
      });
      console.log("req.body", req.body);

      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }),
];

export const updateArticle = [
  upload.array("image", 3),

  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const newImages = Array.isArray(req.files)
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const article = await prisma.article.findUnique({ where: { id: id } });
      if (!article)
        return next({ status: 404, message: "게시글을 찾을 수 없습니다." });

      if (article.userId !== req.user.id)
        return next({ status: 403, message: "권한이 없습니다." });

      const updatedArticle = await prisma.article.update({
        where: { id: id },
        data: {
          title,
          content,
          imageUrls: newImages.length ? newImages : article.imageUrls,
        },
      });

      res.status(200).json(updatedArticle);
    } catch (err) {
      next(err);
    }
  }),
];

export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id: id } });

    if (!article)
      return next({ status: 404, message: "게시글을 찾을 수 없습니다." });

    if (article.userId !== req.user.id)
      return next({ status: 403, message: "권한이 없습니다." });

    await prisma.article.delete({ where: { id: id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
