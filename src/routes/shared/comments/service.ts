import { Response, NextFunction } from "express";
import prisma from "../../../prismaClient";
import {
  CommentBaseRequest,
  CommentCreateRequest,
  CommentResponse,
  CommentFieldType,
  CommentDomain,
  CustomError,
  CommentTable,
  CommentWithUser,
  CommentCreateInput,
} from "../../../types/comment";

// 댓글 작업 실행 함수
const executeCommentOperation = async <T>(
  table: CommentTable,
  operation: string,
  params: any
): Promise<T> => {
  const client = prisma[table] as any;
  return client[operation](params);
};

const getFieldType = (type: CommentDomain): CommentFieldType => {
  if (type === "articles") {
    return {
      commentTable: "articleComment",
      mainTable: "article",
      idField: "articleId",
    };
  } else {
    return {
      commentTable: "productComment",
      mainTable: "product",
      idField: "productId",
    };
  }
};

// 전체 댓글 목록 조회
const getComments = async (
  req: CommentBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const domainId = req.params.domainId!;
    const { lastCursor, type } = req.query;
    const { commentTable, idField } = getFieldType(type);

    const pagination = lastCursor
      ? { skip: 1, cursor: { id: lastCursor } }
      : { skip: 0 };

    const comments = await executeCommentOperation<CommentWithUser[]>(
      commentTable,
      "findMany",
      {
        where: {
          [idField]: domainId,
          deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        ...pagination,
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          User: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      }
    );

    const formattedComments: CommentResponse[] = comments.map(
      (comment: CommentWithUser) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        writer: {
          id: comment.userId,
          nickname: comment.User.nickname,
        },
      })
    );

    res.status(200).send({
      status: 200,
      idField,
      commentsList: formattedComments,
      lastCursor: comments[formattedComments.length - 1]?.id ?? null,
    });
  } catch (error) {
    next(error);
  }
};

// 댓글 등록
const createComment = async (
  req: CommentCreateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const domainId = req.params.domainId!;
    const { type } = req.query;
    const { content } = req.body;
    const { commentTable, mainTable, idField } = getFieldType(type);
    const { id: userId, nickname: userNickname } = req.user;

    // 게시글/상품이 존재하는지 먼저 확인
    const client = prisma[mainTable] as any;
    const domain = await client.findFirst({
      where: {
        id: domainId,
        deletedAt: null,
      },
    });

    if (!domain) {
      const error: CustomError = new Error(
        type === "articles"
          ? "존재하지 않는 게시글입니다."
          : "존재하지 않는 상품입니다."
      );
      error.code = 404;
      error.name = "NotFoundError";
      throw error;
    }

    const newComment = await executeCommentOperation<CommentWithUser>(
      commentTable,
      "create",
      {
        data: {
          content,
          User: {
            connect: {
              id: userId,
            },
          },
          [type === "articles" ? "Article" : "Product"]: {
            connect: {
              id: domainId,
            },
          },
        },
        include: {
          User: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      }
    );

    const response: CommentResponse = {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
      writer: {
        id: userId,
        nickname: userNickname,
      },
    };

    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

// 댓글 수정
const patchComment = async (
  req: CommentCreateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id!;
    const { type } = req.query;
    const { content } = req.body;
    const { commentTable } = getFieldType(type);
    const { id: userId, nickname: userNickname } = req.user;

    const existingComment =
      await executeCommentOperation<CommentWithUser | null>(
        commentTable,
        "findUnique",
        {
          where: {
            id,
            deletedAt: null,
          },
        }
      );

    if (!existingComment) {
      res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
      return;
    }

    // 댓글 작성자와 현재 사용자가 일치하는지 확인
    if (existingComment.userId !== userId) {
      const error: CustomError = new Error("댓글 수정 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    const updatedComment = await executeCommentOperation<CommentWithUser>(
      commentTable,
      "update",
      {
        where: { id },
        data: { content },
      }
    );

    const response: CommentResponse = {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
      writer: {
        id: userId,
        nickname: userNickname,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

// 댓글 삭제
const deleteComment = async (
  req: CommentBaseRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      const error: CustomError = new Error("인증이 필요합니다.");
      error.name = "UnauthorizedError";
      throw error;
    }

    const id = req.params.id!;
    const { type } = req.query;
    const { commentTable } = getFieldType(type);
    const userId = req.user.id;

    const existingComment =
      await executeCommentOperation<CommentWithUser | null>(
        commentTable,
        "findUnique",
        {
          where: {
            id,
            deletedAt: null,
          },
        }
      );

    if (!existingComment) {
      res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
      return;
    }

    // 댓글 작성자와 현재 사용자가 일치하는지 확인
    if (existingComment.userId !== userId) {
      const error: CustomError = new Error("댓글 삭제 권한이 없습니다.");
      error.name = "ForbiddenError";
      throw error;
    }

    const deletedComment = await executeCommentOperation<CommentWithUser>(
      commentTable,
      "update",
      {
        where: { id },
        data: { deletedAt: new Date() },
        select: {
          id: true,
          content: true,
          deletedAt: true,
        },
      }
    );

    if (!deletedComment) {
      const error: CustomError = new Error("댓글을 삭제할 수 없습니다.");
      error.name = "NotFoundError";
      throw error;
    }

    res.status(202).send({
      isSuccess: true,
      message: "삭제 처리가 완료되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};

const service = {
  getComments,
  createComment,
  patchComment,
  deleteComment,
};

export default service;
