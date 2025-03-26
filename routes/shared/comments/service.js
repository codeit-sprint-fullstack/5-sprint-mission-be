import prisma from "../../../prismaClient.js";

const getFieldType = (type) => {
  if (type === "articles") {
    return {
      commentTable: "articleComment",
      mainTable: "article",
      idField: "articleId",
    };
  } else if (type === "products") {
    return {
      commentTable: "productComment",
      mainTable: "product",
      idField: "productId",
    };
  }
};

// 전체 댓글 목록 조회
// 커서 페이지네이션 - 받은 데이터의 마지막 아이디를 lastCursor로 보내줌. 프론트는 다음 요청 시 받은 lastCursor를 쿼리에 담아 보낸다.
export const getComments = async (req, res, next) => {
  try {
    const domainId = req.params.domainId;
    const { lastCursor, type } = req.query;
    const { commentTable, idField } = getFieldType(type);

    //맨 처음에는 skip 안하고, lastCursor가 있을 때에만 skip해서 다음 페이지 보여줌
    const pagination = lastCursor
      ? { skip: 1, cursor: { id: lastCursor } }
      : { skip: 0 };

    //보고있는 게시글의 삭제되지 않은 댓글을 커서 기반으로 불러옴
    const comments = await prisma[commentTable].findMany({
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
    });

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      writer: {
        id: comment.userId,
        nickname: comment.User.nickname,
      },
    }));

    //요청 성공 시 응답 객체
    const response = {
      status: 200,
      idField,
      commentsList: formattedComments, //댓글 목록
      //XXX: 받아온 목록의 마지막 댓글 아이디를 커서로 넘겨줌.
      lastCursor: comments[formattedComments.length - 1]?.id ?? null,
    };

    res.status(200).send(response);
  } catch (e) {
    next(e);
  }
};

//댓글 등록
const createComment = async (req, res, next) => {
  try {
    const domainId = req.params.domainId;
    const { type } = req.query;
    const { content } = req.body;
    const { commentTable, mainTable, idField } = getFieldType(type);
    const userId = req.user.id;

    const newComment = await prisma[commentTable].create({
      data: {
        // 관계 필드명 수정 (Product/Article 대신 productId/articleId 사용)
        userId: userId,
        [idField]: domainId,
        content,
      },
    });

    res.status(201).send(newComment);
  } catch (e) {
    next(e);
  }
};

//댓글 수정
const patchComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { type } = req.query;
    const { content } = req.body;
    const { commentTable } = getFieldType(type);
    const userId = req.user.id;

    // 댓글 존재 여부 및 작성자 확인
    const existingComment = await prisma[commentTable].findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingComment) {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자와 현재 사용자가 일치하는지 확인
    if (existingComment.userId !== userId) {
      return res.status(403).send({ message: "댓글 수정 권한이 없습니다." });
    }

    const updatedComment = await prisma[commentTable].update({
      where: { id },
      data: { content },
    });

    res.status(200).send(updatedComment); //수정된 댓글
  } catch (e) {
    next(e);
  }
};

//댓글 삭제
const deleteComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { type } = req.query;
    const { commentTable } = getFieldType(type);
    const userId = req.user.id;

    // 댓글 존재 여부 확인
    const existingComment = await prisma[commentTable].findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingComment) {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자와 현재 사용자가 일치하는지 확인
    if (existingComment.userId !== userId) {
      return res.status(403).send({ message: "댓글 삭제 권한이 없습니다." });
    }

    //deletedAt 업데이트
    const deletedComment = await prisma[commentTable].update({
      where: { id },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        content: true,
        deletedAt: true,
      },
    });

    res.status(202).send({
      message: "삭제 처리가 완료되었습니다.",
      data: deletedComment,
    });
  } catch (e) {
    next(e);
  }
};

const service = {
  getComments,
  createComment,
  patchComment,
  deleteComment,
};

export default service;
