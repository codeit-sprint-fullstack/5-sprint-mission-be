import { Request } from "express";
import { ArticleComment, ProductComment } from "@prisma/client";

// 기본 사용자 요청 타입
export interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    nickname: string;
  };
}

// 댓글 도메인 타입 (articles 또는 products)
export type CommentDomain = "articles" | "products";

// 댓글 기본 요청 타입
export interface CommentBaseRequest extends UserRequest {
  params: {
    domainId?: string; // 게시글/상품 ID
    id?: string; // 댓글 ID
  };
  query: {
    type: CommentDomain;
    lastCursor?: string;
  };
}

// 댓글 생성/수정 요청 타입
export interface CommentCreateRequest extends CommentBaseRequest {
  body: {
    content: string;
  };
}

// 댓글 응답 타입
export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  writer: {
    id: string;
    nickname: string;
  };
}

// 필드 타입 반환 인터페이스
export interface CommentFieldType {
  commentTable: "articleComment" | "productComment";
  mainTable: "article" | "product";
  idField: "articleId" | "productId";
}

// 커스텀 에러 타입
export interface CustomError extends Error {
  code?: number;
  name: string;
}

// Prisma 댓글 타입
export type PrismaComment = ArticleComment | ProductComment;

// 댓글 테이블 타입
export type CommentTable = "articleComment" | "productComment";

// Prisma 댓글 조회 결과 타입
export type CommentWithUser = {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  User: {
    id: string;
    nickname: string;
  };
};

// Prisma 댓글 수정 입력 타입
export type CommentUpdateInput = {
  content?: string;
  deletedAt?: Date;
};
