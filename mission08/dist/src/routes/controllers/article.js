"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_1 = require("../services/article/article");
const comment_1 = require("../services/article/comment");
const router = express_1.default.Router();
router.get("/best", article_1.getArticleTop3); // 인기 게시글 목록 조회 : /post/top3
router.get("/", article_1.getArticleList); // 게시글 목록 조회 : /post/
router.get("/:id", article_1.getArticle); // 특정 게시글 조회 (댓글까지 조회) : /post/:id
router.post("/", article_1.createArticle); // 게시글 작성 : /post/
router.patch("/:id", article_1.updateArticle); // 특정 게시글 수정 : /post/:id
router.delete("/:id", article_1.deleteArticle); // 특정 게시글 삭제 : /post/:id
router.post("/:id/comment", comment_1.createArticleComment); // 댓글 작성 : /post/:id/comment/
router.patch("/comment/:id", comment_1.updateArticleComment); // 댓글 수정 : /post/comment/:id
router.delete("/comment/:id", comment_1.deleteArticleComment); // 댓글 삭제 : /post/comment/:id
exports.default = router;
