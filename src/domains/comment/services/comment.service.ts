import { Users } from "@prisma/client";
import { CustomError } from "../../../utils/errorHandler";
import { toCommentResponse } from "../../../utils/mappers/comment.mapper";
import prisma from "../../../utils/prismaClient";
import { AuthInfo } from "../../auth/interfaces/auth.interface";
import {
  CommentListResponse,
  CommentRequest,
  CommentResponse,
} from "../interfaces/comment.interface";

type CreateComment = (
  date: CommentRequest,
  authInfo: AuthInfo,
  resourceType: string,
  resourceId: string
) => Promise<CommentResponse>;
type GetCommentList = (
  limit: number,
  resourceType: string,
  resourceId: string
) => Promise<CommentListResponse>;
type PatchComment = (
  resourceType: string,
  resourceId: string,
  data: CommentRequest,
  authInfo: AuthInfo
) => Promise<CommentResponse>;
type DeleteComment = (
  resourceType: string,
  resourceId: string,
  authInfo: AuthInfo
) => Promise<void>;

/**
 *
 * @param data
 * @param authInfo
 * @param resourceType
 * @param resourceId
 * @returns
 */
const createComment: CreateComment = async (
  data,
  authInfo,
  resourceType,
  resourceId
) => {
  const user = await getUserOrThrow(authInfo.userId);

  const comment = await prisma.comments.create({
    data: {
      content: data.content,
      resourceType,
      resourceId,
      userId: user.id,
    },
  });

  return toCommentResponse(comment, user);
};

/**
 *
 * @param limit
 * @param resourceType
 * @param resourceId
 * @returns
 */
const getCommentList: GetCommentList = async (
  limit,
  resourceType,
  resourceId
) => {
  const comments = await prisma.comments.findMany({
    where: { resourceType, resourceId },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const userIds = new Set(comments.map((comment) => comment.userId));
  const users = await prisma.users.findMany({
    where: { id: { in: Array.from(userIds) } },
  });

  const userMap = new Map(users.map((user) => [user.id, user]));

  const commentList = comments.map((comment) => {
    const user = userMap.get(comment.userId);
    if (!user) throw new CustomError("User not found", 400);
    return toCommentResponse(comment, user);
  });

  return { list: commentList };
};

/**
 *
 * @param resourceType
 * @param resourceId
 * @param data
 * @param authInfo
 * @returns
 */
const patchComment: PatchComment = async (
  resourceType,
  resourceId,
  data,
  authInfo
) => {
  const user = await getUserOrThrow(authInfo.userId);

  const comment = await prisma.comments.findUnique({
    where: {
      resourceType_resourceId_userId: {
        resourceType,
        resourceId,
        userId: user.id,
      },
    },
  });

  if (!comment) throw new CustomError("Comment not found", 404);

  const updatedComment = await prisma.comments.update({
    where: { id: comment.id },
    data: { content: data.content },
  });

  return toCommentResponse(updatedComment, user);
};

const deleteComment: DeleteComment = async (
  resourceType,
  resourceId,
  authInfo
) => {
  const user = await getUserOrThrow(authInfo.userId);

  const comment = await prisma.comments.findUnique({
    where: {
      resourceType_resourceId_userId: {
        resourceType,
        resourceId,
        userId: user.id,
      },
    },
  });

  if (!comment) throw new CustomError("Comment not found", 404);

  await prisma.comments.delete({ where: { id: comment.id } });
};

/**
 *
 * @param userId
 * @returns
 */
const getUserOrThrow = async (userId: string): Promise<Users> => {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new CustomError("User not found", 400);
  return user;
};

const commentService = {
  createComment,
  getCommentList,
  patchComment,
  deleteComment,
};

export default commentService;
