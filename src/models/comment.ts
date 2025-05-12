import { Prisma } from "@prisma/client";
import { SuccessResponse } from "@/types/response";

export interface getCommentListDto {
  cursor: number;
  pageSize: number;
  productId?: number;
  articleId?: number;
}

export interface postCommentDto {
  authorId: number;
  content: string;
  productId?: number;
  articleId?: number;
}

export interface patchCommentDto {
  authorId: number;
  content: string;
  id: number;
}

export interface deleteCommentDto {
  authorId: number;
  id: number;
}

export interface commentResponseWithNextCursor
  extends SuccessResponse<CommentWithAuthor[]> {
  nextCursor: number | null;
}

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        nickname: true;
        profileImg: true;
      }
    }
  }
}>