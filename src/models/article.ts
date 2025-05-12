import { Prisma } from "@prisma/client";

export interface GetArticleListDto {
  page: number;
  pageSize: number;
  keyword: string | undefined;
  orderBy: string | undefined;
}

export interface ArticlesWithTotalCount {
  articles: ArticleWithAuthor[];
  totalCount: number;
}

export type ArticleWithAuthor = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        nickname: true;
        profileImg: true;
      };
    };
  };
}>;

export type ArticleWithAuthorAndIsLiked = ArticleWithAuthor & {
  isLiked: boolean;
};

export interface ArticlePostAndPatchDto {
  authorId: number;
  title: string;
  content: string;
  img: Array<string>;
}
