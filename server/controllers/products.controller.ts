import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";
import multer from "multer";
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

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, take = 10, sortBy = "createdAt" } = req.query;
    const limit = Number(take);
    const skip = (Number(page) - 1) * limit;
    const rawSearch = req.query.search;
    const searchValue = typeof rawSearch === "string" ? rawSearch : "";

    let orderByCondition:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[] = { createdAt: "desc" };

    if (sortBy === "favorites") {
      orderByCondition = [
        { favorites: { _count: "desc" } },
        { createdAt: "desc" },
      ];
    }

    const whereCondition: Prisma.ProductWhereInput =
      searchValue.length > 0
        ? {
            OR: [
              {
                name: {
                  contains: searchValue,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                description: {
                  contains: searchValue,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {};

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        take: limit,
        skip,
        orderBy: orderByCondition,
        where: whereCondition,
        include: {
          _count: {
            select: { favorites: true, comments: true },
          },
        },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    res.status(200).json({ products, totalCount });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrls: true,
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

    if (!product)
      return next({ status: 404, message: "상품을 찾을 수 없습니다." });

    const isLiked = userId ? product.favorites.length > 0 : false;
    const favoriteCount = product._count.favorites;

    const { favorites, _count, ...response } = product;

    res.status(200).send({ ...response, isLiked, favoriteCount });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      return next({ status: 401, message: "로그인이 필요합니다." });

    const { name, description, price, tags } = req.body;
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return next({ status: 400, message: "가격 형식이 올바르지 않습니다." });
    }

    let parsedTags: string[] = [];
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) throw new Error();
      } catch {
        return next({ status: 400, message: "태그 형식이 올바르지 않습니다." });
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const imageUrls = Array.isArray(req.files)
      ? req.files.map(
          (file: Express.Multer.File) =>
            `/uploads/${encodeURIComponent(file.filename)}`
        )
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        tags: { set: parsedTags },
        imageUrls: { set: imageUrls },
        userId: req.user.id,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags, imageUrls } = req.body;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return next({ status: 404, message: "상품을 찾을 수 없습니다." });
    if (product.userId !== req.user?.id)
      return next({ status: 403, message: "권한이 없습니다." });

    let updatedData: Prisma.ProductUpdateInput = {
      name,
      description,
      price: parseFloat(price) || 0,
    };

    let parsedTags: string[] = [];
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) throw new Error();
      } catch {
        return next({
          status: 400,
          message: "태그 형식이 올바르지 않습니다.",
        });
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      updatedData.imageUrls = {
        set: req.files.map(
          (file: Express.Multer.File) =>
            `/uploads/${encodeURIComponent(file.filename)}`
        ),
      };
    }

    if (imageUrls) {
      updatedData.imageUrls = { set: imageUrls };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updatedData,
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product)
      return next({ status: 404, message: "상품을 찾을 수 없습니다." });
    if (product.userId !== req.user?.id)
      return next({ status: 403, message: "삭제 권한이 없습니다." });

    await prisma.product.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
