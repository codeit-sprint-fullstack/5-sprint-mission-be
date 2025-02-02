import express from "express";
import commentService from "./service.js";

const router = express.Router();

// 댓글 등록
router.post("/:articleId", commentService.createComment);

// 댓글 목록 조회
router.get("/:articleId", commentService.getCommentsByArticle);

// 댓글 수정
router.patch("/:commentId", commentService.updateComment);

// 댓글 삭제
router.delete("/:commentId", commentService.deleteComment);

export default router;
