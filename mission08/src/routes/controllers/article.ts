import express from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticleList,
  getArticleTop3,
  updateArticle,
} from "../services/article/article";
import {
  createArticleComment,
  deleteArticleComment,
  updateArticleComment,
} from "../services/article/comment";

const router = express.Router();

router.get("/best", getArticleTop3); // 인기 게시글 목록 조회 : /post/top3

router.get("/", getArticleList); // 게시글 목록 조회 : /post/
router.get("/:id", getArticle); // 특정 게시글 조회 (댓글까지 조회) : /post/:id
router.post("/", createArticle); // 게시글 작성 : /post/
router.patch("/:id", updateArticle); // 특정 게시글 수정 : /post/:id
router.delete("/:id", deleteArticle); // 특정 게시글 삭제 : /post/:id

router.post("/:id/comment", createArticleComment); // 댓글 작성 : /post/:id/comment/
router.patch("/comment/:id", updateArticleComment); // 댓글 수정 : /post/comment/:id
router.delete("/comment/:id", deleteArticleComment); // 댓글 삭제 : /post/comment/:id

export default router;
