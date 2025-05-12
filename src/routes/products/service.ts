import { Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../../prismaClient";
import {
  ProductListRequest,
  ProductBaseRequest,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductResponse,
  ProductWithDetails,
  CustomError,
  ProductUpdateData,
} from "../../types/product";

// 전체 상품 목록 조회
const getProductList = async (
  req: ProductListRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const orderBy = req.query.orderBy || "recent";
    const sortOption: Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput> =
      orderBy === "favorite"
        ? [
            { favoritesCount: Prisma.SortOrder.desc },
            { createdAt: Prisma.SortOrder.desc },
          ]
        : {
            createdAt:
              orderBy === "recent"
                ? Prisma.SortOrder.desc
                : Prisma.SortOrder.asc,
          };

    const keyword = req.query.keyword || "";

    const searchCriteria: Prisma.ProductWhereInput = {
      AND: [
        {
          OR: [
            {
              name: { contains: keyword, mode: Prisma.QueryMode.insensitive },
            },
            {
              description: {
                contains: keyword,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              ProductTag: {
                some: {
                  tag: {
                    contains: keyword,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          ],
        },
        { deletedAt: null },
      ],
    };

    const userId = req.user?.id;

    let likedProductIds: string[] = [];
    if (userId) {
      const userLikes = await prisma.likeProduct.findMany({
        where: {
          userId: userId,
          deletedAt: null,
        },
        select: {
          productId: true,
        },
      });

      likedProductIds = userLikes.map((item) => item.productId);
    }

    const products = await prisma.product.findMany({
      where: searchCriteria,
      orderBy: sortOption,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        favoritesCount: true,
        createdAt: true,
        updatedAt: true,
        ProductTag: {
          select: {
            tag: true,
          },
        },
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      skip,
      take: pageSize,
    });

    const formattedProducts: ProductResponse[] = products.map((product) => {
      const isLiked = userId ? likedProductIds.includes(product.id) : false;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        tags: product.ProductTag.map((pt) => pt.tag),
        likeCount: product.favoritesCount,
        isLiked: isLiked,
        ownerId: product.User.id,
        ownerNickname: product.User.nickname,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    });

    const totalProducts = await prisma.product.count({
      where: searchCriteria,
    });
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).send({
      ProductList: formattedProducts,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// 상품 상세 조회
const getProduct = async (
  req: ProductBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    const product = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        ProductTag: true,
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!product) {
      const error: CustomError = new Error("상품을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    let isLiked = false;
    if (userId) {
      const likeExists = await prisma.likeProduct.findFirst({
        where: {
          userId: userId,
          productId: id,
          deletedAt: null,
        },
      });

      isLiked = !!likeExists;
    }

    const productWithLike = {
      ...product,
      likeCount: product.favoritesCount,
      isLiked: isLiked,
      ownerId: product.User.id,
      ownerNickname: product.User.nickname,
      User: undefined,
    };

    res.status(200).send(productWithLike);
  } catch (error) {
    next(error);
  }
};

// 상품 등록
const createProduct = async (
  req: ProductCreateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const { name, description, price, images = [], tags = [] } = req.body;
    const { id: userId } = req.user;

    const imageArray = Array.isArray(images)
      ? images
      : [images].filter(Boolean);

    const newProduct = await prisma.product.create({
      data: {
        userId,
        name,
        description,
        price: Number(price),
        images: imageArray,
        ProductTag: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { tag },
            create: { tag },
          })),
        },
      },
      include: {
        ProductTag: true,
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    const responseProduct = {
      ...newProduct,
      ownerId: newProduct.User.id,
      ownerNickname: newProduct.User.nickname,
      User: undefined,
    };

    res.status(201).send(responseProduct);
  } catch (error) {
    next(error);
  }
};

// id로 선택한 상품 수정
const patchProduct = async (
  req: ProductUpdateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id;
    const { name, description, price, images = [], tags = [] } = req.body;
    const { id: userId } = req.user;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        ProductTag: true,
      },
    });

    if (!existingProduct) {
      const error: CustomError = new Error("상품을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    // 상품 소유자 확인
    if (existingProduct.userId !== userId) {
      const error: CustomError = new Error("상품을 수정할 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    const updateData: Prisma.ProductUpdateInput = {
      name,
      description,
      price: Number(price),
      images: images || [],
    };

    if (tags) {
      updateData.ProductTag = {
        //기존에 있던 태그는 테이블 연결 해제하고 새로운 태그 연결해주기
        disconnect: existingProduct.ProductTag.map((tag) => ({ id: tag.id })),
        connectOrCreate:
          tags.length > 0
            ? tags.map((tag) => ({
                where: { tag },
                create: { tag },
              }))
            : [],
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        ProductTag: true,
        User: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    const responseProduct = {
      ...updatedProduct,
      ownerId: updatedProduct.User.id,
      ownerNickname: updatedProduct.User.nickname,
      User: undefined,
    };

    res.status(200).send(responseProduct);
  } catch (error) {
    next(error);
  }
};

// 상품 삭제
const deleteProduct = async (
  req: ProductBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id;
    const { id: userId } = req.user;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingProduct) {
      const error: CustomError = new Error("상품을 찾을 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    if (existingProduct.userId !== userId) {
      const error: CustomError = new Error("상품을 삭제할 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    const deletedProduct = await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        deletedAt: true,
      },
    });

    if (!deletedProduct) {
      const error: CustomError = new Error("상품을 삭제할 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    res.status(202).send({
      isSuccess: true,
      message: "삭제 처리가 완료되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

// 상품 좋아요
const createLike = async (
  req: ProductBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const { id } = req.params;
    const { id: userId } = req.user;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!product) {
        const error: CustomError = new Error("상품을 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      const existingLike = await tx.likeProduct.findFirst({
        where: {
          userId,
          productId: id,
          deletedAt: null,
        },
      });

      if (existingLike) {
        const error: CustomError = new Error("이미 좋아요한 상품입니다.");
        error.name = "ValidationError";
        throw error;
      }

      const like = await tx.likeProduct.create({
        data: {
          userId,
          productId: id,
        },
      });

      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          favoritesCount: { increment: 1 },
        },
        include: {
          ProductTag: true,
          User: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      return {
        like,
        product: {
          ...updatedProduct,
          isLiked: true,
          ownerId: updatedProduct.User.id,
          ownerNickname: updatedProduct.User.nickname,
          User: undefined,
        },
      };
    });

    res.status(201).send({
      isSuccess: true,
      data: result.product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLike = async (
  req: ProductBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const { id } = req.params;
    const { id: userId } = req.user;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!product) {
        const error: CustomError = new Error("상품을 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      const existingLike = await tx.likeProduct.findFirst({
        where: {
          userId,
          productId: id,
          deletedAt: null,
        },
      });

      if (!existingLike) {
        const error: CustomError = new Error("좋아요 정보를 찾을 수 없습니다.");
        error.name = "NotFoundError";
        throw error;
      }

      const deletedLike = await tx.likeProduct.update({
        where: { id: existingLike.id },
        data: {
          deletedAt: new Date(),
        },
      });

      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          favoritesCount: { decrement: 1 },
        },
        include: {
          ProductTag: true,
          User: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      return {
        deletedLike,
        product: {
          ...updatedProduct,
          isLiked: false,
          ownerId: updatedProduct.User.id,
          ownerNickname: updatedProduct.User.nickname,
          User: undefined,
        },
      };
    });

    res.status(200).send({
      message: "좋아요가 취소되었습니다.",
      data: result.product,
    });
  } catch (error) {
    next(error);
  }
};

const service = {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
  createLike,
  deleteLike,
};

export default service;
