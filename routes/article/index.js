import express from "express";
import articleController from "./controller/article.controller.js";

const router = express();

router.get("/", articleController.fetchArticleList);
router.get("/:id", articleController.fetchArticle);
router.post("/", articleController.addArticle);
router.patch("/", articleController.modifyArticle);
router.delete("/:id", articleController.removeArticle);

export default router;
