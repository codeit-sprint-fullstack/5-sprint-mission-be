import { Products } from "@prisma/client";
import { ProductResponse } from "../../domains/product/interfaces/product.interface";

type User = {
  ownerId: string,
  ownerNickname: string,
}

export const toProductResponse = (product: Products, user: User, isFavorite?: boolean): ProductResponse => {
  const response: ProductResponse = {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images,
    tags: product.tags,
    ownerId: user.ownerId,
    ownerNickname: user.ownerNickname,
    favoriteCount: product.favoriteCount,
    createdAt: product.createdAt,
  };

  if (typeof isFavorite !== 'undefined') {
    response.isFavorite = isFavorite;
  }

  return response;
}
