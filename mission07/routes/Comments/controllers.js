import express from "express";
import {
  getProductCommentList,
  createProductComment,
  updateProductComment,
  deleteProductComment,
} from "./productService.js";
import {
  getArticleCommentList,
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
} from "./articleService.js";

const router = express.Router();

router.get("/product", getProductCommentList);
router.post("/product", createProductComment);
router.patch("/product/:id", updateProductComment);
router.delete("/product/:id", deleteProductComment);

router.get("/article", getArticleCommentList);
router.post("/article", createArticleComment);
router.patch("/article/:id", updateArticleComment);
router.delete("/article/:id", deleteArticleComment);

export default router;
