import prisma from "../config/prismaClient.js";
import multer from "multer";
import { validateProduct } from "../middlewares/validateProduct.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

export const getProducts = async (req, res, next) => {
  try {
    const { cursor, take = 10, sortBy = "createdAt", search = "" } = req.query;
    const limit = Number(take);

    let orderByCondition = { createdAt: "desc" };

    if (sortBy === "favorites") {
      orderByCondition = [
        { favorites: { _count: "desc" } },
        { createdAt: "desc" },
      ];
    }

    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const products = await prisma.product.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: orderByCondition,
      where: whereCondition,
      include: {
        _count: {
          select: { favorites: true, comments: true },
        },
      },
    });

    let nextCursor = null;
    if (products.length > limit) {
      nextCursor = products.pop().id;
    }
    res.status(200).send({ success: true, products, nextCursor });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
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

export const createProduct = [
  upload.array("images", 3),
  validateProduct,
  asyncHandler(async (req, res, next) => {
    try {
      if (!req.user)
        return next({ status: 401, message: "로그인이 필요합니다." });

      const { name, description, price, tags } = req.body;

      const parsePrice = Number(price) || 0;

      if (typeof tags === "string") {
        try {
          tags = JSON.parse(tags);
        } catch (error) {
          return next({
            status: 400,
            message: "태그 형식이 올바르지 않습니다.",
          });
        }
      }

      const imageUrls = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parsePrice,
          tags: tags || [],
          imageUrls: { set: imageUrls },
          userId: req.user.id,
        },
      });

      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }),
];

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags, imageUrls } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product)
      return next({ status: 404, message: "상품을 찾을 수 없습니다." });

    if (req.user.id !== product.userId) {
      return next({ status: 403, message: "수정 권한이 없습니다." });
    }

    let updatedData = {};

    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (price) updatedData.price = Number(price) || 0;

    if (tags) {
      if (typeof tags === "string") {
        try {
          updatedData.tags = JSON.parse(tags);
        } catch (error) {
          return next({
            status: 400,
            message: "태그 형식이 올바르지 않습니다.",
          });
        }
      } else {
        updatedData.tags = tags;
      }
    }

    if (req.files && req.files.length > 0) {
      updatedData.imageUrls = {
        set: req.files.map((file) => `/uploads/${file.filename}`),
      };
    }

    if (imageUrls) {
      if (Array.isArray(imageUrls)) {
        updatedData.imageUrls = { set: imageUrls };
      } else {
        return next({
          status: 400,
          message: "imageUrls 형식이 올바르지 않습니다.",
        });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: updatedData,
    });

    res.status(200).send(updatedProduct);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product)
      return next({ status: 404, message: "상품을 찾을 수 없습니다." });

    if (req.user.id !== product.userId) {
      return next({ status: 403, message: "삭제 권한이 없습니다." });
    }
    await prisma.product.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
