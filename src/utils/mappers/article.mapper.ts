import { Articles } from "@prisma/client";
import { ArticleResponse } from "../../domains/article/interdaces/article.interface";

type User = {
  ownerId: string,
  ownerNickname: string,
}

export const toArticleResponse = (article: Articles, user: User, isLikeed?: boolean): ArticleResponse => {
  const writer =
  {
    id: user.ownerId,
    nickname: user.ownerNickname,
  }

  const response: ArticleResponse = {
    id: article.id,
    title: article.title,
    content: article.content,
    image: article.image ?? '',
    writer,
    likeCount: article.likeCount,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };

  if (typeof isLikeed !== 'undefined') {
    response.isLiked = isLikeed;
  }

  return response;
}
