import { Request } from "express";
import { Article } from "@prisma/client";

// 기본 사용자 요청 타입
export interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    nickname: string;
  };
}

// 게시글 기본 요청 타입
export interface ArticleBaseRequest extends UserRequest {
  params: {
    id: string;
  };
}

// 게시글 생성/수정 요청 타입
export interface ArticleCreateRequest extends ArticleBaseRequest {
  body: {
    title: string;
    content: string;
    images?: string[];
    tags?: string[];
  };
}

// 게시글 목록 조회 요청 타입
export interface ArticleListRequest extends UserRequest {
  query: {
    page?: string;
    limit?: string;
    sort?: "recent" | "favorite";
    keyword?: string;
  };
}

// Prisma 조인 결과 타입
export interface ArticleWithUser extends Article {
  User: {
    id: string;
    nickname: string;
  };
}

// 게시글 응답 타입
export interface ArticleResponse {
  id: string;
  title: string;
  content: string;
  image: string | null;
  likeCount: number;
  isLiked: boolean;
  ownerId: string;
  ownerNickname: string;
  createdAt: string;
  updatedAt: string;
}

// 커스텀 에러 타입
export interface CustomError extends Error {
  code?: number;
  name: string;
}
