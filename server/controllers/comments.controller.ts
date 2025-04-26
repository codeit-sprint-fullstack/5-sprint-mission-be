import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId, productId } = req.params;
    const { cursor, take = 10 } = req.query;

    const takeNumber = Number(take);
    if (isNaN(takeNumber) || takeNumber <= 0) {
      return next({ status: 400, message: "올바른 take 값이 필요합니다." });
    }

    const comments = await prisma.comment.findMany({
      take: takeNumber,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: String(cursor) } : undefined,
      where: {
        articleId: articleId || undefined,
        productId: productId || undefined,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, nickname: true } },
      },
    });

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    const { articleId, productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next({ status: 401, message: "로그인이 필요합니다." });
    }

    if (!articleId && !productId) {
      return next({
        status: 400,
        message: "게시글 또는 상품 ID가 필요합니다.",
      });
    }

    if (!content?.trim()) {
      return next({ status: 400, message: "댓글 내용을 입력해주세요." });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        articleId: articleId || null,
        productId: productId || null,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, nickname: true } },
      },
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next({ status: 401, message: "로그인이 필요합니다." });
    }

    if (!content?.trim()) {
      return next({ status: 400, message: "수정할 댓글 내용을 입력해주세요." });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return next({ status: 404, message: "댓글을 찾을 수 없습니다." });
    }

    if (existingComment.userId !== userId) {
      return next({ status: 403, message: "본인 댓글만 수정할 수 있습니다." });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next({ status: 401, message: "로그인이 필요합니다." });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return next({ status: 404, message: "댓글을 찾을 수 없습니다." });
    }

    if (existingComment.userId !== userId) {
      return next({ status: 403, message: "본인 댓글만 삭제할 수 있습니다." });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
