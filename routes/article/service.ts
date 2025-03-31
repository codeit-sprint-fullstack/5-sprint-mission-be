import { Request, Response } from "express";
import prisma from "../../prismaClient.js";
import { Prisma } from "@prisma/client";

// 게시글 리스트 조회
const getArticleList = async (req: Request, res: Response): Promise<void> => {
  const {
    page = "1",
    pageSize = "10",
    keyword = "",
    order = "recent",
  } = req.query as {
    page?: string;
    pageSize?: string;
    keyword?: string;
    order?: string;
  };

  if (
    isNaN(Number(page)) ||
    isNaN(Number(pageSize)) ||
    typeof keyword !== "string" ||
    typeof order !== "string"
  ) {
    res.status(400).send({ message: "올바르지 않은 params 형식입니다." });
    return;
  }

  let orderOption: Prisma.ArticleOrderByWithRelationInput = {};
  switch (order) {
    case "recent":
      orderOption = { createdAt: "desc" };
      break;
    case "favorite":
      orderOption = { likeCount: "desc" };
      break;
    default:
      res.status(400).send({ message: "잘못 된 order 값입니다." });
      return;
  }

  const articles = await prisma.article.findMany({
    where: {
      OR: [
        {
          title: {
            contains: keyword,
          },
        },
        {
          content: {
            contains: keyword,
          },
        },
      ],
    },
    select: {
      id: true,
      idx: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: orderOption,
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
  });

  const totalSize = await prisma.article.count(); // 개수만 바로 반환 하니까 성능 상 좋음

  res.status(200).send({ articles, totalSize });
  return;
};

// 게시글 등록
const postArticle = async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const newArticle = await prisma.article.create({
    data: { ...req.body, authorId },
  });
  res.send(newArticle);
};

// 게시글 수정
const patchArticle = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { authorId, ...dataWithoutAuthorId } = req.body;
  const updatedArticle = await prisma.article.update({
    where: {
      id: id,
    },
    data: dataWithoutAuthorId,
  });
  res.send(updatedArticle);
};

// 게시글 단일 조회
const getArticle = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const article = await prisma.article.findFirst({
    where: {
      idx: Number(id),
    },
  });
  if (!article)
    res.status(404).send({ message: "존재하지 않는 게시물입니다." });
  res.status(200).send(article);
};

// 게시글 삭제
const deleteArticle = async (req: Request, res: Response) => {
  const id = req.params.id;

  const article = await prisma.article.delete({
    where: {
      id,
    },
  });
  res.status(200).send({ message: "삭제 완료" });
};

const service = {
  getArticleList,
  postArticle,
  patchArticle,
  getArticle,
  deleteArticle,
};

export default service;
