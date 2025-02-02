import express from "express";
import articleService from "./service.js";

const router = express.Router();

// 게시글 등록
router.post("/", articleService.createArticle);

// 게시글 목록 조회
router.get("/", articleService.getArticle);

// 게시글 단일 조회
router.get("/:id", articleService.getIdArticle);

// 게시글 수정
router.patch("/:id", articleService.updateArticle);

// 게시글 삭제
router.delete("/:id", articleService.deleteArticle);

export default router;
