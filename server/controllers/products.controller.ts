import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";
import { Prisma } from "@prisma/client";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rawPage = req.query.page;
    const rawLimit = req.query.limit;
    const sortBy = req.query.sortBy || "createdAt";

    const page =
      rawPage !== undefined && rawPage !== "undefined" ? Number(rawPage) : 1;
    const limit =
      rawLimit !== undefined && rawLimit !== "undefined"
        ? Number(rawLimit)
        : 10;

    const parsedPage = isNaN(page) || page < 1 ? 1 : page;
    const parsedLimit = isNaN(limit) || limit < 1 ? 10 : limit;

    const skip = (parsedPage - 1) * parsedLimit;

    const rawSearch = req.query.search;
    const searchValue = typeof rawSearch === "string" ? rawSearch.trim() : "";

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

    let orderByCondition:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[] = { createdAt: "desc" };

    if (sortBy === "favorites") {
      orderByCondition = [
        { favorites: { _count: "desc" } },
        { createdAt: "desc" },
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: parsedLimit,
        orderBy: orderByCondition,
        where: whereCondition,
        include: {
          _count: {
            select: {
              favorites: true,
              comments: true,
            },
          },
          favorites: req.user
            ? { where: { userId: req.user.id }, select: { id: true } }
            : undefined,
        },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);
    const result = products.map((product) => {
      const isLiked =
        Array.isArray(product.favorites) && product.favorites.length > 0;
      const favoriteCount = product._count?.favorites || 0;
      const { favorites, _count, ...rest } = product;

      return {
        ...rest,
        isLiked,
        favoriteCount,
      };
    });
    res.status(200).json({ products: result, totalCount });
    return;
  } catch (err) {
    console.error("[BACKEND] getProducts error:", err);
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
        tags: true,
        imageUrls: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
        favorites: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    if (!product)
      return next({ status: 404, message: "상품을 찾을 수 없습니다." });

    const isLiked = userId
      ? product.favorites.some((fav) => fav.userId === userId)
      : false;
    const favoriteCount = product._count?.favorites ?? 0;

    res.status(200).json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      imageUrls: product.imageUrls,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      user: product.user,
      comments: product.comments,
      isLiked,
      favoriteCount,
    });
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

    if (typeof tags === "string" && tags.length > 0) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) throw new Error();
      } catch {
        console.error("[❌ 태그 파싱 실패]:", tags);
        return next({ status: 400, message: "태그 형식이 올바르지 않습니다." });
      }
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

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return next({ status: 400, message: "가격 형식이 올바르지 않습니다." });
    }

    let parsedTags: string[] = [];

    if (typeof tags === "string" && tags.length > 0) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) throw new Error();
      } catch {
        return next({ status: 400, message: "태그 형식이 올바르지 않습니다." });
      }
    }

    let updatedData: Prisma.ProductUpdateInput = {
      name,
      description,
      price: parsedPrice,
      tags: { set: parsedTags },
    };

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
