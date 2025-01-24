import express from "express";
import {
  getArticleList,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./service.js";

const router = express.Router();

router.get("/", getArticleList);
router.get("/:id", getArticle);
router.post("/", createArticle);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
