import express from "express";
import service from "./service.js";

const router = express.Router();
router.get("/:id", service.getCommentList);
router.post("/article/:articleId" , service.postCommentArticle);
router.post("/product/:productId" , service.postCommentProduct);
router.delete("/:id",service.deleteComment);
router.patch("/:id",service.patchComment);

export default router;