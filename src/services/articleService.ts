import prisma from "@/config/database";
import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { Article } from "@/generated/prisma";
import {
  ArticlesWithTotalCount,
  GetArticleListDto,
  ArticlePostAndPatchDto,
  ArticleWithAuthor,
  ArticleWithAuthorAndIsLiked,
} from "@/models/article";
import { SuccessResponse } from "@/types/response";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function getArticleList(
  getArticleListInput: GetArticleListDto
): Promise<SuccessResponse<ArticlesWithTotalCount>> {
  let orderOption = {};
  switch (getArticleListInput.orderBy) {
    case "recent":
      orderOption = { createdAt: "desc" };
      break;
    case "favorite":
      orderOption = { likeCount: "desc" };
      break;
    default:
      orderOption = { createdAt: "desc" };
  }

  const articles = await prisma.article.findMany({
    where: {
      title: {
        contains: getArticleListInput.keyword,
      },
    },
    orderBy: orderOption,
    skip: (getArticleListInput.page - 1) * getArticleListInput.pageSize,
    take: getArticleListInput.pageSize,
    include: {
      author: {
        select: {
          nickname: true,
          profileImg: true,
        },
      },
    },
  });

  const totalCount = await prisma.article.count({
    where: {
      title: {
        contains: getArticleListInput.keyword,
      },
    },
  });

  return createSuccessResponse<ArticlesWithTotalCount>(
    { totalCount, articles },
    "게시물 리스트 조회에 성공했습니다."
  );
}

async function getArticleById(
  id: number,
  userId?: number
): Promise<SuccessResponse<ArticleWithAuthor>> {
  const article = await prisma.article.findFirst({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          nickname: true,
          profileImg: true,
        },
      },
    },
  });

  if (!article) {
    throw new BadRequestException("존재하지 않는 게시물입니다.");
  }

  if (!userId) {
    return createSuccessResponse<ArticleWithAuthor>(
      article,
      "게시물 조회에 성공했습니다!"
    );
  }

  const like = await prisma.favorite.findFirst({
    where: {
      articleId: id,
      userId,
    },
  });

  let isLiked: boolean = like ? true : false;
  const articleWithIsLiked = { ...article, isLiked };

  return createSuccessResponse<ArticleWithAuthorAndIsLiked>(
    articleWithIsLiked,
    "게시물 조회에 성공했습니다!"
  );
}

async function postArticle(
  postAndPatchInput: ArticlePostAndPatchDto
): Promise<SuccessResponse<Article>> {
  const newArticle = await prisma.article.create({
    data: {
      authorId: postAndPatchInput.authorId,
      title: postAndPatchInput.title,
      content: postAndPatchInput.content,
      img: postAndPatchInput.img,
    },
  });

  return createSuccessResponse<Article>(
    newArticle,
    "게시물 생성에 성공했습니다!"
  );
}

async function deleteArticle(id: number): Promise<SuccessResponse<null>> {
  await prisma.article.delete({
    where: {
      id,
    },
  });

  return createSuccessResponse<null>(null, "게시물이 삭제되었습니다!");
}

async function updateArticle(
  id: number,
  postAndPatchInput: ArticlePostAndPatchDto
): Promise<SuccessResponse<Article>> {
  const updatedArticle = await prisma.article.update({
    where: {
      id,
    },
    data: {
      title: postAndPatchInput.title,
      content: postAndPatchInput.content,
      img: postAndPatchInput.img,
    },
  });

  return createSuccessResponse<Article>(
    updatedArticle,
    "게시물이 성공적으로 업데이트 되었습니다."
  );
}

const articleService = {
  getArticleList,
  getArticleById,
  postArticle,
  deleteArticle,
  updateArticle,
};

export default articleService;
