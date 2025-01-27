import express from "express";
import service from "./service.js";

const router = express.Router();

router.post("/posts", service.postNewArticle);
router.get("/:id", service.getArticleById);
router.patch("/:id", service.patchArticle);
router.delete("/:id", service.deleteArticle);
router.get("/", service.getArticlesList);

export default router;
