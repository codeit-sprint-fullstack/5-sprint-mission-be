import { Request, Response } from "express";
import prisma from "../../prismaClient.js";

// 게시글에 해당하는 댓글 리스트 조회
// 커서기반 페이지네이션 해야함.
const getCommentList = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { pageSize = "5", targetType, cursor = null } = req.query;
  const pageSizeNum = Number(pageSize);

  if (cursor && typeof cursor !== "string") {
    res.status(400).send({ message: "잘못된 cursor 형식입니다." });
    return;
  }
  if (isNaN(pageSizeNum) || pageSizeNum <= 0) {
    res.status(400).send({ message: "잘못 된 pageSize 형식입니다." });
    return;
  }

  const comments = await prisma.comment.findMany({
    where: {
      targetType: String(targetType),
      targetId: id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      nickname: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSizeNum + 1, // 하나 더 요청하여 다음 페이지 확인용
    ...(cursor && {
      cursor: {
        id: String(cursor),
      },
    }),
  });

  const hasNextPage = comments.length > pageSizeNum;
  const nextCursor = hasNextPage ? comments[pageSizeNum].id : null;
  console.log(comments)
  res.json({
    list: hasNextPage ? comments.slice(0, pageSizeNum) : comments, // 마지막 페이지이면 모든 댓글 반환
    nextCursor, // 더 이상 페이지가 없으면 null
  });
};

// 게시글에 댓글 달기
const postCommentArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const articleId = req.params.articleId;
  const authorId = req.user?.id;
  const nickname = req.user?.nickname;
  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });
  if (!article)
    res.status(404).send({ message: "아이디에 해당하는 게시글이 없습니다." });

  const newComment = await prisma.comment.create({
    data: {
      ...req.body,
      targetId: articleId,
      targetType: "article",
      authorId,
      nickname,
    },
  });
  res.status(200).send(newComment);
};

// 상품에 댓글 달기
const postCommentProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.productId;
  const authorId = req.user?.id;
  const nickname = req.user?.nickname;
  console.log("productId", productId);
  const newComment = await prisma.comment.create({
    data: {
      ...req.body,
      targetId: productId,
      targetType: "product",
      authorId,
      nickname,
    },
  });
  res.status(200).send(newComment);
};

// 댓글 삭제
const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  await prisma.comment.delete({
    where: {
      id,
    },
  });
  res.status(200).send({ message: "댓글 삭제 완료" }); // 아이디에 해당하는 댓글이 없을 시 에러 처리해야함.
};

// 댓글 수정
const patchComment = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  if (!comment)
    res.status(404).send({ message: "아이디에 해당하는 댓글이 없습니다." });

  const updatedComment = await prisma.comment.update({
    where: {
      id,
    },
    data: req.body,
  });
  res.status(200).send(updatedComment); // id에 해당하는 댓글이 없으면 에러처리
};

const service = {
  getCommentList,
  postCommentArticle,
  deleteComment,
  patchComment,
  postCommentProduct,
};

export default service;
