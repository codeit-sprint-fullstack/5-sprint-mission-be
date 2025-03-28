import { Comments, Users } from "@prisma/client";
import { CommentResponse } from "../../domains/comment/interfaces/comment.interface";

export const toCommentResponse = (
  comment: Comments,
  user: Users
): CommentResponse => {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    writer: {
      id: user.id,
      nickname: user.nickname,
      image: user.image ?? "",
    },
  };
};
