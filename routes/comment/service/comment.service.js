import prisma from "../../../prismaClient.js";

const fetchCommentList = async (cursor, limit, resourceType, resourceId) => {
  const take = parseInt(limit) || 10; // 한 번에 가져올 데이터 개수
  const cursorOptions = cursor
    ? { skip: 1, cursor: { id: cursor } } // 이전 데이터를 건너뜁니다.
    : {};

  return await prisma.comments.findMany({
    ...cursorOptions,
    take,
    where: {
      resourceType,
      resourceId,
    },
    orderBy: { createdAt: "asc" },
  });
};

const fetchCommentCount = async (resourceType, resourceId) => {
  return await prisma.comments.count({
    where: {
      resourceType,
      resourceId,
    },
  });
};

const addComment = async (resourceType, resourceId, content) => {
  try {
    return await prisma.comments.create({
      data: { resourceType, resourceId, content },
    });
  } catch (err) {
    throw new Error(`- Database error while add comments :: ${err.message}`);
  }
};
const modifyComment = async (id, content) => {
  try {
    return await prisma.comments.update({
      data: { content },
      where: {
        id,
      },
    });
  } catch (err) {
    throw new Error(`- Database error while modify comment :: ${err.message}`);
  }
};
const removeComment = async (id) => {
  try {
    return await prisma.comments.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    throw new Error(`- Database error while remove comment :: ${err.message}`);
  }
};

const existComment = async (id) => {
  try {
    const comment = await prisma.comments.findUnique({
      where: {
        id,
      },
    });
    return !!comment;
  } catch (err) {
    throw new Error(`- Database error while exist comment :: ${err.message}`);
  }
};

const commentService = {
  fetchCommentList,
  addComment,
  modifyComment,
  removeComment,
  fetchCommentCount,
  existComment,
};

export default commentService;
