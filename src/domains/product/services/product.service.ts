import { Users } from "@prisma/client";
import { toProductResponse } from "../../../utils/mappers/product.mapper";
import prisma from "../../../utils/prismaClient";
import { AuthInfo } from "../../auth/interfaces/auth.interface";
import { ProductListResponse, ProductRequest, ProductResponse } from "../interfaces/product.interface";
import { CustomError } from "../../../utils/errorHandler";
import { PaginationQueryDto } from "../../../utils/query.dto";

type CreateProduct = (data: ProductRequest, authInfo: AuthInfo) => Promise<ProductResponse>;
type GetProductList = (params: PaginationQueryDto) => Promise<ProductListResponse>;
type GetProductDetail = (productId: string, authInfo: AuthInfo) => Promise<ProductResponse>;
type PatchProduct = (productId: string, data: ProductRequest, authInfo: AuthInfo) => Promise<ProductResponse>;
type DeleteProductDetail = (productId: string, authInfo: AuthInfo) => Promise<string>;

/**
 * 
 * @param data 
 * @param authInfo 
 * @returns 
 */
const createProduct: CreateProduct = async (data, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);

  const product = await prisma.products.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      images: data.images,
      tags: data.tags,
      userId: user.id,
    }
  });

  return toProductResponse(product, { ownerId: user.id, ownerNickname: user.nickname });
}

/**
 * 
 * @param params 
 * @param authInfo 
 * @returns 
 */
const getProductList: GetProductList = async (params) => {
  const { page, pageSize, orderBy, keyword } = params;
  const orderByOption = orderBy === 'favorite'
    ? { favoriteCount: 'desc' as const }
    : { createdAt: 'desc' as const };

  const totalCount = await prisma.products.count({
    where: {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { tags: { hasSome: [keyword] } },
      ],
    },
  });

  const productList = await prisma.products.findMany({
    where: {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { tags: { hasSome: [keyword] } },
      ],
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderByOption
  });

  const userIds = new Set(productList.map(product => product.userId));
  const users = await prisma.users.findMany({
    where: { id: { in: Array.from(userIds) } },
    select: { id: true, nickname: true }
  });
  const userMap = new Map(users.map(user => [user.id, user]));

  const productListWithFavorite = productList.map(product => {
    const owner = userMap.get(product.userId);
    return toProductResponse(product, {
      ownerId: owner?.id!,
      ownerNickname: owner?.nickname!,
    });
  });

  return {
    totalCount,
    list: productListWithFavorite
  };
}

/**
 * 
 * @param productId 
 * @param authInfo 
 * @returns 
 */
const getProductDetail: GetProductDetail = async (productId, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);

  const product = await prisma.products.findUnique({ where: { id: productId } });
  if (!product)
    throw new CustomError('Product not found', 404);

  const favorite = await prisma.favorites.findUnique({
    where: {
      userId_resourceType_resourceId: {
        userId: user.id,
        resourceType: 'PRODUCT',
        resourceId: product.id,
      },
    }
  });

  return toProductResponse(product, { ownerId: user.id, ownerNickname: user.nickname }, !!favorite);
}

/**
 * 
 * @param productId 
 * @param data 
 * @param authInfo 
 * @returns 
 */
const patchProduct: PatchProduct = async (productId, data, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);

  const product = await prisma.products.findUnique({ where: { id: productId } });
  if (!product)
    throw new CustomError('Product not found', 404);

  if (product.userId !== user.id)
    throw new CustomError('You are not the owner of this product', 403);

  const updatedProduct = await prisma.products.update({
    where: { id: productId },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      images: data.images,
      tags: data.tags,
    }
  });

  return toProductResponse(updatedProduct, { ownerId: user.id, ownerNickname: user.nickname });
}

const deleteProduct: DeleteProductDetail = async (productId, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);

  const product = await prisma.products.findUnique({ where: { id: productId } });
  if (!product)
    throw new CustomError('Product not found', 404);

  if (product.userId !== user.id)
    throw new CustomError('You are not the owner of this product', 403);

  await prisma.products.delete({ where: { id: productId } });

  return productId;
}

/**
 * 
 * @param userId 
 * @returns 
 */
const getUserOrThrow = async (userId: string): Promise<Users> => {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user)
    throw new CustomError('User not found', 400);
  return user;
}

/**
 * 
 */
const productService = {
  createProduct,
  getProductList,
  getProductDetail,
  patchProduct,
  deleteProduct
}

export default productService;