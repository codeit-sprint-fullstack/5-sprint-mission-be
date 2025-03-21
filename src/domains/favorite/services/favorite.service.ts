import { Users } from "@prisma/client";
import { CustomError } from "../../../utils/errorHandler";
import { toProductResponse } from "../../../utils/mappers/product.mapper";
import prisma from "../../../utils/prismaClient";
import { ProductResponse } from "../../product/interfaces/product.interface";
import { AuthInfo } from "../../auth/interfaces/auth.interface";

type FavoriteMapper = (resourceType: string, resourceId: string, authInfo: AuthInfo) => Promise<ProductResponse>;

const createProductFavorite: FavoriteMapper = async (resourceType, resourceId, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);

  const favorite = await prisma.favorites.findUnique({
    where: {
      userId_resourceType_resourceId: {
        userId: user.id,
        resourceType,
        resourceId
      },
    }
  });

  if (favorite) {
    throw new CustomError('Product already favorited', 400);
  }

  const product = await prisma.products.update({
    where: {
      id: resourceId
    },
    data: {
      favoriteCount: {
        increment: 1
      }
    }
  });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  await prisma.favorites.create({
    data: {
      userId: user.id,
      resourceType,
      resourceId: resourceId
    }
  });

  return toProductResponse(product, user);
}

const deleteProductFavorite: FavoriteMapper = async (resourceType, resourceId, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);

  const favorite = await prisma.favorites.findUnique({
    where: {
      userId_resourceType_resourceId: {
        userId: user.id,
        resourceType,
        resourceId
      },
    }
  });

  if (!favorite) {
    throw new CustomError('Product not favorited', 400);
  }

  const product = await prisma.products.update({
    where: {
      id: resourceId
    },
    data: {
      favoriteCount: {
        decrement: 1
      }
    }
  });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  await prisma.favorites.delete({
    where: {
      userId_resourceType_resourceId: {
        userId: user.id,
        resourceType,
        resourceId
      },
    }
  });

  return toProductResponse(product, user);
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

const favoriteService = {
  createProductFavorite,
  deleteProductFavorite
}

export default favoriteService;