import { Request } from "express";
import { Product, ProductTag } from "@prisma/client";

// 기본 사용자 요청 타입
export interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    nickname: string;
  };
}

// 상품 목록 조회 요청 타입
export interface ProductListRequest extends UserRequest {
  query: {
    page?: string;
    pageSize?: string;
    orderBy?: "recent" | "favorite";
    keyword?: string;
  };
}

// 상품 기본 요청 타입
export interface ProductBaseRequest extends UserRequest {
  params: {
    id: string;
  };
}

// 상품 생성/수정 요청 타입
export interface ProductCreateRequest extends UserRequest {
  body: {
    name: string;
    description: string;
    price: string | number;
    images?: string[];
    tags?: string[];
  };
}

// 상품 수정 요청 타입
export interface ProductUpdateRequest extends ProductBaseRequest {
  body: {
    name?: string;
    description?: string;
    price?: string | number;
    images?: string[];
    tags?: string[];
  };
}

// 상품 응답 타입
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  likeCount: number;
  isLiked: boolean;
  ownerId: string;
  ownerNickname: string;
  createdAt: string;
  updatedAt: string;
}

// Prisma 상품 조회 결과 타입
export interface ProductWithDetails extends Product {
  ProductTag: ProductTag[];
  User: {
    id: string;
    nickname: string;
  };
}

// 커스텀 에러 타입
export interface CustomError extends Error {
  code?: number;
  name: string;
}

// 상품 업데이트 데이터 타입
export type ProductUpdateData = {
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  ProductTag?: {
    disconnect: { id: string }[];
    connectOrCreate: {
      where: { tag: string };
      create: { tag: string };
    }[];
  };
};
