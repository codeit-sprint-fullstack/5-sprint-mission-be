import prisma from "@/config/database";
import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { favoriteDto } from "@/models/favorite";
import { ProductWithOwnerAndIsFavorite } from "@/models/product";
import { SuccessResponse } from "@/types/response";
import { Prisma } from "@/generated/prisma";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function productPostFavorite(
  postFavoriteInput: favoriteDto
): Promise<SuccessResponse<ProductWithOwnerAndIsFavorite>> {
  const { productId, userId } = postFavoriteInput;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    }
  });

  if(!product) throw new BadRequestException('존재하지 않는 상품입니다.')

  const favorite = await prisma.favorite.findFirst({
    where: {
      productId,
      userId,
    },
  });

  if (favorite) throw new BadRequestException("이미 찜한 상품입니다.");

  const result = await prisma.$transaction(
    async(tx: Prisma.TransactionClient) => {
      await prisma.favorite.create({
        data: {
          productId,
          userId,
        },
      });
      const favoriteProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          favoriteCount: { increment: 1 },
        },
        include: {
          owner: {
            select: {
              profileImg: true,
              nickname: true,
            }
          }
        }
      });
      const productWithIsFavorite = { ...favoriteProduct, isFavorite: true };
      return productWithIsFavorite;
    }
  )
  return createSuccessResponse<ProductWithOwnerAndIsFavorite>(result,'상품을 찜했습니다!')
}

async function productDeleteFavorite(
  deleteFavoriteInput : favoriteDto
): Promise<SuccessResponse<null>> {
  const { productId, userId } = deleteFavoriteInput;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    }
  });

  if(!product) throw new BadRequestException('존재하지 않는 상품입니다.')

  const favorite = await prisma.favorite.findFirst({
    where: {
      productId,
      userId,
    },
  });

  if (!favorite) throw new BadRequestException("찜하지 않은 상품입니다.");

  await prisma.$transaction(
    async(tx: Prisma.TransactionClient) => {
      await prisma.favorite.delete({
        where: {
          id: favorite.id,
        },
      });
      const favoriteProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          favoriteCount: { decrement: 1 },
        },
        include: {
          owner: {
            select: {
              profileImg: true,
              nickname: true,
            }
          }
        }
      });
      const productWithIsFavorite = { ...favoriteProduct, isFavorite: true };
      return productWithIsFavorite;
    }
  )
  return createSuccessResponse<null>(null,'찜하기 해제하였습니다.')

}

const favoriteService = {
  productPostFavorite,
  productDeleteFavorite,
}

export default favoriteService;