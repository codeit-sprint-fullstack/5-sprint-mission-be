import express from "express";
import deleteArticle from "./services/deleteArticle.js";
import getArticleById from "./services/getArticleById.js";
import getArticleList from "./services/getArticleList.js";
import patchArticle from "./services/patchArticle.js";
import postNewArticle from "./services/postNewArticle.js";
import postArticleComment from "./services/postArticleComment.js";
import getArticleCommentList from "./services/getArticleCommentList.js";
import patchArticleComment from "./services/patchArticleComment.js";
import deleteArticleComment from "./services/deleteArticleComment.js";

const router = express.Router();

router.post("/", postNewArticle);
router.get("/:id", getArticleById);
router.patch("/:id", patchArticle);
router.delete("/:id", deleteArticle);
router.get("/", getArticleList);

// 댓글
router.post(":articleId/comments", postArticleComment);
router.get(":articleId/comments", getArticleCommentList);
router.patch("/:articleId/comments/:commentId", patchArticleComment);
router.delete("/:articleId/comments/:commentId", deleteArticleComment);

export default router;
