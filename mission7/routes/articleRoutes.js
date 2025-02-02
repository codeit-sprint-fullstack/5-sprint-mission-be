import express from "express";
import * as articleController from "../controllers/articleController.js";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

// 게시글 라우트
// GET /api/articles - 게시글 목록 조회 (검색, 페이지네이션 포함)
router.get("/", articleController.getArticles);

// GET /api/articles/:id - 특정 게시글 조회
router.get("/:id", articleController.getArticleById);

// POST /api/articles - 새 게시글 작성
router.post("/", articleController.createArticle);

// PATCH /api/articles/:id - 게시글 수정
router.patch("/:id", articleController.updateArticle);

// DELETE /api/articles/:id - 게시글 삭제
router.delete("/:id", articleController.deleteArticle);

// 게시글 댓글 라우트
// GET /api/articles/:articleId/comments - 게시글의 댓글 목록 조회
router.get("/:articleId/comments", commentController.getComments);

// POST /api/articles/:articleId/comments - 게시글에 새 댓글 작성
router.post("/:articleId/comments", commentController.createComment);

export default router;
