import express from "express";
import service from "./service.js";

const router = express.Router();

router.get("/", service.getArticleList);
router.get("/:id", service.getArticle);
router.post("/", service.createArticle);
router.patch("/:id", service.patchArticle);
router.delete("/:id", service.deleteArticle);

export default router;
