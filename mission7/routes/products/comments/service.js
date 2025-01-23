import prisma from "../../../prismaClient.js";

// 전체 댓글 목록 조회
// 커서 페이지네이션 - 받은 데이터의 마지막 아이디를 lastCursor로 보내줌. 프론트는 다음 요청 시 받은 lastCursor를 쿼리에 담아 보낸다.
const getComments = async (req, res) => {
  try {
    const productId = req.params.domainId;
    const { lastCursor } = req.query;
    //맨 처음에는 skip 안하고, lastCursor가 있을 때에만 skip해서 다음 페이지 보여줌
    const pagination = lastCursor
      ? { skip: 1, cursor: { id: lastCursor } }
      : { skip: 0 };

    //보고있는 게시글의 삭제되지 않은 댓글을 커서 기반으로 불러옴
    const comments = await prisma.productsComments.findMany({
      where: {
        productId,
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
      productId,
      commentsList: comments, //댓글 목록
      //XXX: 받아온 목록의 마지막 댓글 아이디를 커서로 넘겨줌.
      //FIXME: 다음 페이지가 없을 때 서버에러로 넘어가는데, 이거 처리해보자.
      lastCursor: comments[comments.length - 1].id,
    };

    res.status(200).send(response);
  } catch (e) {
    console.log("err:", e);
    res.status(500).send({ message: "서버 에러입니다." });
  }
};

// 댓글 등록
const createComment = async (req, res) => {
  try {
    const productId = req.params.domainId;
    const { content } = req.body;

    const newComment = await prisma.productsComments.create({
      data: {
        product: { connect: { id: productId } },
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

// id로 선택한 댓글 수정
const patchComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { content } = req.body;

    // 댓글 존재 여부 확인
    const existingComment = await prisma.productsComments.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingComment) {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    const updatedComment = await prisma.productsComments.update({
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

// 댓글 삭제
const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;

    // 댓글 존재 여부 확인
    const existingComment = await prisma.productsComments.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingComment) {
      return res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
    }

    //deletedAt 업데이트
    const deletedComment = await prisma.productsComments.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
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
    // console.log("err: ", e);
    res.status(500).send("서버 에러입니다.");
  }
};

const service = {
  getComments,
  createComment,
  patchComment,
  deleteComment,
};

export default service;
