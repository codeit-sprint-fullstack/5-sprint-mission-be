import asyncHandler from "../asyncHandler.js";
import { CreateArticle, PatchArticle } from "../../structs.js";
import { assert } from "superstruct";

export const getArticleList = asyncHandler(async (req, res) => {
  const { cursor, pageSize, orderBy } = req.query;

  // 정렬 기준 설정
  let orderCondition = {};
  switch (orderBy) {
    case "favorite":
      orderCondition = { favoriteCount: "desc" };
      break;
    case "recent":
    default:
      orderCondition = { createdAt: "desc" };
  }

  // 커서 기반 데이터 조회
  const articles = await prisma.article.findMany({
    orderBy: orderCondition,
    cursor: cursor ? { id: cursor } : null, // 커서 설정
    skip: cursor ? 1 : 0, // 커서 기준으로 다음 데이터 가져오기 위해 skip 설정
    take: parseInt(pageSize), // 요청된 페이지 크기만큼 데이터 가져오기
  });

  // 다음 커서 및 hasNextPage 계산
  const nextCursor =
    articles.length > 0 ? articles[articles.length - 1].id : null;
  const hasNextPage = articles.length === parseInt(pageSize);

  res.status(200).send({ articles, nextCursor, hasNextPage });
});

export const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id },
  });
  res.send(article);
});

export const createArticle = asyncHandler(async (req, res) => {
  assert(req.body, CreateArticle);
  const data = req.body;
  const userId = req.data.id;

  // create article
  const article = await prisma.article.create({
    data: { ...data, userId },
  });

  res.status(201).send(article);
});

export const updateArticle = asyncHandler(async (req, res) => {
  assert(req.body, PatchArticle);
  const id = req.params.id;
  const data = req.body;

  // update article
  const article = await prisma.article.update({
    where: { id },
    data,
  });

  res.status(203).send(article);
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // delete article
  await prisma.article.delete({
    where: { id },
  });

  res.sendStatus(204);
});
