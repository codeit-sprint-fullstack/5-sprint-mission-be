import { Products, Users } from "@prisma/client";
import { ProductResponse } from "../../domains/product/interfaces/product.interface";

export const toProductResponse = (product: Products, user: Users, isFavorite?: boolean): ProductResponse => {
  const response: ProductResponse = {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images,
    tags: product.tags,
    ownerId: user.id,
    ownerNickname: user.nickname,
    favoriteCount: product.favoriteCount,
    createdAt: product.createdAt,
  };

  if (typeof isFavorite !== 'undefined') {
    response.isFavorite = isFavorite;
  }

  return response;
}
