import express from "express";
import service from "./service.js";
const router = express.Router();
router
    .route("/:id")
    .get(service.getCommentList)
    .delete(service.deleteComment)
    .patch(service.patchComment);
router.post("/article/:articleId", service.postCommentArticle);
router.post("/product/:productId", service.postCommentProduct);
export default router;
