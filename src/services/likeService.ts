import prisma from "@/config/database";
import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { Prisma } from "@prisma/client";
import { ArticleWithAuthorAndIsLiked } from "@/models/article";
import { likeDto } from "@/models/like";
import { SuccessResponse } from "@/types/response";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function articlePostLike(
  postLikeInput: likeDto
): Promise<SuccessResponse<ArticleWithAuthorAndIsLiked>> {
  const { articleId, userId } = postLikeInput;
  const article = await prisma.article.findFirst({
    where: {
      id: articleId,
    },
  });

  if (!article) throw new BadRequestException("존재하지 않는 게시물입니다.");

  const like = await prisma.favorite.findFirst({
    where: {
      articleId,
      userId,
    },
  });

  if (like) throw new BadRequestException("이미 좋아요를 누른 게시물입니다.");

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await tx.favorite.create({
        data: {
          articleId,
          userId,
        },
      });
      const likedArticle = await tx.article.update({
        where: {
          id: articleId,
        },
        data: {
          likeCount: { increment: 1 },
        },
        include: {
          author: {
            select: {
              profileImg: true,
              nickname: true,
            },
          },
        },
      });
      const articleWithIsLiked = { ...likedArticle, isLiked: true };
      return articleWithIsLiked;
    }
  );
  return createSuccessResponse<ArticleWithAuthorAndIsLiked>(
    result,
    "게시글에 좋아요를 눌렀습니다!"
  );
}

async function articleDeleteLike (
  deleteLikeInput : likeDto
): Promise<SuccessResponse<null>> {
  const { articleId, userId } = deleteLikeInput;
  
  const article = await prisma.article.findFirst({
    where: {
      id: articleId,
    }
  });

  if(!article) throw new BadRequestException('존재하지 않는 상품입니다.')
  
  const like = await prisma.favorite.findFirst({
    where: {
      articleId,
      userId,
    }
  })

  if(!like) throw new BadRequestException("좋아요를 누르지 않은 게시물입니다.");
  
  await prisma.$transaction(
    async(tx: Prisma.TransactionClient) => {
      await tx.favorite.delete({
        where: {
          id: like.id,
        },
      });
      const likedArticle = await tx.article.update({
        where: {
          id: articleId,
        },
        data: {
          likeCount: { decrement: 1 },
        },
        include: {
          author: {
            select: {
              profileImg: true,
              nickname: true,
            }
          }
        }
      });
      const articleWithIsLiked = { ...likedArticle, isLiked: false };
      return articleWithIsLiked;
    }
  )
  return createSuccessResponse<null>(null,'좋아요를 해제했습니다.')
}

const likeService = {
  articlePostLike,
  articleDeleteLike,
}

export default likeService;