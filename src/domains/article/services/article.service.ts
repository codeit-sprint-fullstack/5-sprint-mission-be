import { Articles, Users } from "@prisma/client";
import { CustomError } from "../../../utils/errorHandler";
import { toArticleResponse } from "../../../utils/mappers/article.mapper";
import prisma from "../../../utils/prismaClient";
import { PaginationQueryDto } from "../../../utils/query.dto";
import { AuthInfo } from "../../auth/interfaces/auth.interface";
import { ArticleListResponse, ArticleRequest, ArticleResponse } from "../interdaces/article.interface";

type GetArticleList = (params: PaginationQueryDto) => Promise<ArticleListResponse>;
type CreateArticle = (data: ArticleRequest, authInfo: AuthInfo) => Promise<ArticleResponse>;
type GetArticleDetail = (articleId: string) => Promise<ArticleResponse>;
type PatchArticle = (articleId: string, data: ArticleRequest, authInfo: AuthInfo) => Promise<ArticleResponse>;
type DeleteArticle = (articleId: string, authInfo: AuthInfo) => Promise<void>;

const getArticleList: GetArticleList = async (params) => {
  const { page, pageSize, orderBy, keyword } = params;
  const orderByOption = orderBy === 'favorite'
    ? { favoriteCount: 'desc' as const }
    : { createdAt: 'desc' as const };

  const totalCount = await prisma.articles.count({
    where: {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } }
      ],
    },
  });

  const articleList = await prisma.articles.findMany({
    where: {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } }
      ],
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderByOption
  });

  const userIds = new Set(articleList.map(article => article.userId));
  const users = await prisma.users.findMany({
    where: { id: { in: Array.from(userIds) } },
    select: { id: true, nickname: true }
  });
  const userMap = new Map(users.map(user => [user.id, user]));

  const articleListWithUser = articleList.map(article => {
    const user = userMap.get(article.userId);
    if (!user)
      throw new CustomError('User not found', 400);
    return toArticleResponse(article, { ownerId: user.id, ownerNickname: user.nickname });
  });

  return {
    totalCount,
    list: articleListWithUser
  };
}

/**
 * 
 * @param data 
 * @param authInfo 
 * @returns 
 */
const createArticle: CreateArticle = async (data, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);
  const article = await prisma.articles.create({
    data: {
      title: data.title,
      content: data.content,
      image: data.image ?? '',
      userId: user.id
    }
  });

  return toArticleResponse(article, { ownerId: user.id, ownerNickname: user.nickname });
}

/**
 * 
 * @param articleId 
 * @returns 
 */
const getArticleDetail: GetArticleDetail = async (articleId) => {
  const article = await prisma.articles.findUnique({ where: { id: articleId } });
  if (!article)
    throw new CustomError('Article not found', 400);

  const user = await getUserOrThrow(article.userId);
  return toArticleResponse(article, { ownerId: user.id, ownerNickname: user.nickname });
}

/**
 * 
 * @param articleId 
 * @param data 
 * @param authInfo 
 * @returns 
 */
const patchArticle: PatchArticle = async (articleId, data, authInfo) => {
  const user = await getUserOrThrow(authInfo.userId);

  const article = await prisma.articles.findUnique({ where: { id: articleId } });
  if (!article)
    throw new CustomError('Article not found', 400);

  if (article.userId !== authInfo.userId)
    throw new CustomError('Unauthorized', 401);

  const updatedArticle = await prisma.articles.update({
    where: { id: articleId },
    data: {
      title: data.title,
      content: data.content,
      image: data.image ?? ''
    }
  });

  return toArticleResponse(updatedArticle, { ownerId: user.id, ownerNickname: user.nickname });
}

/**
 * 
 * @param articleId 
 * @param authInfo 
 * @returns 
 */
const deleteArticle: DeleteArticle = async (articleId, authInfo) => {
  const article = await prisma.articles.findUnique({ where: { id: articleId } });
  if (!article)
    throw new CustomError('Article not found', 400);

  if (article.userId !== authInfo.userId)
    throw new CustomError('Unauthorized', 401);

  await prisma.articles.delete({ where: { id: articleId } });

  return;
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

const articleService = {
  getArticleList,
  createArticle,
  getArticleDetail,
  patchArticle,
  deleteArticle
}

export default articleService;