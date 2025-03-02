import express from "express";
import service from "./service.js";

const router = express.Router();

router.get("/", service.getArticleList);
router.post("/", service.postArticle);
router.patch("/:id", service.patchArticle);
router.get("/:id", service.getArticle);
router.delete("/:id", service.deleteArticle);

export default router;