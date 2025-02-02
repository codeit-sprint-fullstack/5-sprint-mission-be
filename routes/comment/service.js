import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 📝댓글 등록 함수
const createComment = async (req, res) => {
  try {
    const { articleId } = req.params; // URL에서 articleId 받아오기
    const { content, userId } = req.body; // 본문에서 content와 userId 받아오기

    // articleId와 userId가 없으면 오류 발생
    if (!articleId || !userId || !content) {
      return res
        .status(400)
        .send({ message: "articleId, userId, content는 필수입니다." });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        article: { connect: { id: articleId } }, // 댓글이 연결될 게시글의 ID
      },
    });
    res.status(201).send(newComment);
  } catch (err) {
    console.log("에러 확인용", err);
    res.status(500).send({
      message: "댓글 등록 중 오류가 발생했습니다.",
    });
  }
};

// 📝댓글 조회 함수
const getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { cursorId, limit = 10 } = req.query; // cursorId: 이전 페이지의 마지막 댓글 ID

    const comments = await prisma.comment.findMany({
      where: { articleId: articleId }, // 해당 게시글의 댓글만 조회
      take: Number(limit), // 페이지당 가져올 댓글 수
      skip: cursorId ? 1 : 0, // 커서가 있을 경우 첫 번째 댓글은 건너뜀
      cursor: cursorId ? { id: cursorId } : undefined, // 커서로 해당 ID 이후의 댓글부터 가져옴
      orderBy: {
        createdAt: "asc", // 댓글을 생성일 순으로 오름차순 정렬
      },
    });

    const nextCursorId =
      comments.length > 0 ? comments[comments.length - 1].id : null;

    res.send({
      comments,
      nextCursorId,
    });
  } catch (err) {
    console.log("에러 확인용", err);
    res.status(500).send({
      message: "댓글 조회 중 오류가 발생했습니다.",
    });
  }
};

// 📝댓글 수정 함수
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: req.body,
    });
    res.send(updatedComment);
  } catch (err) {
    console.log("에러 확인용", err);
    res.status(500).send({
      message: "댓글 수정 중 오류가 발생했습니다.",
    });
  }
};

// 📝댓글 삭제 함수
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: { id: commentId },
    });
    res.status(200).send({
      message: "댓글이 삭제되었습니다.",
    });
  } catch (err) {
    console.log("에러 확인용", err);
    res.status(500).send({
      message: "댓글 삭제 중 오류가 발생했습니다.",
    });
  }
};

// 서비스 객체에 함수들 추가
const commentService = {
  createComment,
  getCommentsByArticle,
  updateComment,
  deleteComment,
};

export default commentService;
