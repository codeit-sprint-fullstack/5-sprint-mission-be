import prisma from "../../../prismaClient.js";

const getFieldType = (type) => {
  if (type === "articles") {
    return {
      commentTable: "articlesComments",
      mainTable: "article",
      idField: "articleId",
    };
  } else if (type === "products") {
    return {
      commentTable: "productsComments",
      mainTable: "product",
      idField: "productId",
    };
  }
};

// 전체 댓글 목록 조회
// 커서 페이지네이션 - 받은 데이터의 마지막 아이디를 lastCursor로 보내줌. 프론트는 다음 요청 시 받은 lastCursor를 쿼리에 담아 보낸다.
export const getComments = async (req, res) => {
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
      },
    });

    //요청 성공 시 응답 객체
    const response = {
      status: 200,
      idField,
      commentsList: comments, //댓글 목록
      //XXX: 받아온 목록의 마지막 댓글 아이디를 커서로 넘겨줌.
      lastCursor: comments[comments.length - 1]?.id ?? null,
    };

    res.status(200).send(response);
  } catch (e) {
    // console.log("err:", e);
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

//댓글 등록
const createComment = async (req, res) => {
  try {
    const domainId = req.params.domainId;
    const { type } = req.query;
    const { content } = req.body;
    const { commentTable, mainTable } = getFieldType(type);

    const newComment = await prisma[commentTable].create({
      data: {
        [mainTable]: { connect: { id: domainId } },
        content,
      },
    });

    res.status(201).send(newComment);
  } catch (e) {
    // console.log("e", e);
    //기타 서버 에러
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

//댓글 수정
const patchComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { type } = req.query;
    const { content } = req.body;
    const { commentTable } = getFieldType(type);

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

    const updatedComment = await prisma[commentTable].update({
      where: { id },
      data: { content },
    });

    res.status(200).send(updatedComment); //수정된 댓글
  } catch (e) {
    //기타 서버 에러
    // console.log("err: ", e);
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

//댓글 삭제
const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { type } = req.query;
    const { commentTable } = getFieldType(type);

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
    //기타 서버 에러
    // console.log("err: ", e);
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

const service = {
  getComments,
  createComment,
  patchComment,
  deleteComment,
};

export default service;
