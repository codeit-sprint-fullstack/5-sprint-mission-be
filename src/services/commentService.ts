import prisma from "@/config/database";
import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { ForbiddenException } from "@/exceptions/ForbiddenExceptions";
import { Comment } from "@prisma/client";
import {
  commentResponseWithNextCursor,
  CommentWithAuthor,
  deleteCommentDto,
  getCommentListDto,
  patchCommentDto,
  postCommentDto,
} from "@/models/comment";
import { SuccessResponse } from "@/types/response";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function getProductCommentList(
  getProductCommentInput: getCommentListDto
): Promise<commentResponseWithNextCursor> {
  const comments = await prisma.comment.findMany({
    where: {
      productId: getProductCommentInput.productId,
    },
    take: getProductCommentInput.pageSize + 1,
    ...(getProductCommentInput.cursor && {
      skip: 1,
      cursor: {
        id: getProductCommentInput.cursor,
      },
    }),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          nickname: true,
          profileImg: true,
        },
      },
    },
  });

  const hasNextPage = comments.length > getProductCommentInput.pageSize;
  const items = hasNextPage ? comments.slice(0, -1) : comments;
  const result = createSuccessResponse<CommentWithAuthor[]>(
    items,
    "댓글 리스트 조회에 성공했습니다!"
  );

  return {
    ...result,
    nextCursor: hasNextPage ? items[items.length - 1].id : null,
  };
}

async function getArticleCommentList(
  getArticleCommentInput: getCommentListDto
): Promise<commentResponseWithNextCursor> {
  const comments = await prisma.comment.findMany({
    where: {
      articleId: getArticleCommentInput.articleId,
    },
    take: getArticleCommentInput.pageSize + 1,
    ...(getArticleCommentInput.cursor && {
      skip: 1,
      cursor: {
        id: getArticleCommentInput.cursor,
      },
    }),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          nickname: true,
          profileImg: true,
        },
      },
    },
  });
  const hasNextPage = comments.length > getArticleCommentInput.pageSize;
  const items = hasNextPage ? comments.slice(0, -1) : comments;
  const result = createSuccessResponse<CommentWithAuthor[]>(
    items,
    "댓글 리스트 조회에 성공했습니다!"
  );

  return {
    ...result,
    nextCursor: hasNextPage ? items[items.length - 1].id : null,
  };
}

async function postProductComment(
  postCommentInput: postCommentDto
): Promise<SuccessResponse<Comment>> {
  const { authorId, content, productId } = postCommentInput;
  const newComment = await prisma.comment.create({
    data: {
      authorId,
      content,
      productId,
    },
  });

  return createSuccessResponse<Comment>(
    newComment,
    "댓글을 성공적으로 생성하였습니다."
  );
}

async function postArticleComment(
  postCommentInput: postCommentDto
): Promise<SuccessResponse<Comment>> {
  const { authorId, content, articleId } = postCommentInput;
  const newComment = await prisma.comment.create({
    data: {
      authorId,
      content,
      articleId,
    },
  });

  return createSuccessResponse<Comment>(
    newComment,
    "댓글을 성공적으로 생성하였습니다."
  );
}

async function updateComment(
  updateCommentInput: patchCommentDto
): Promise<SuccessResponse<Comment>> {
  const { authorId, content, id } = updateCommentInput;

  const comment = await prisma.comment.findFirst({
    where: {
      id,
    },
  });

  if (!comment) throw new BadRequestException("댓글을 찾을 수 없습니다.");
  if (authorId !== comment?.authorId) throw new ForbiddenException();

  const updatedComment = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });

  return createSuccessResponse<Comment>(
    updatedComment,
    "댓글이 수정되었습니다!"
  );
}

async function deleteComment(
  deleteCommentInput: deleteCommentDto
): Promise<SuccessResponse<null>> {
  const { authorId, id } = deleteCommentInput;

  const comment = await prisma.comment.findFirst({
    where: {
      id,
    },
  });

  if (!comment) throw new BadRequestException("댓글을 찾을 수 없습니다.");
  if (authorId !== comment?.authorId) throw new ForbiddenException();

  await prisma.comment.delete({
    where: {
      id,
    },
  });

  return createSuccessResponse<null>(null, "댓글이 삭제되었습니다!");
}

const commentService = {
  getProductCommentList,
  getArticleCommentList,
  postProductComment,
  postArticleComment,
  updateComment,
  deleteComment,
};

export default commentService;
