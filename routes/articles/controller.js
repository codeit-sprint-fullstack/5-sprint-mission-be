import express from "express";
import deleteArticle from "./services/deleteArticle.js";
import getArticleById from "./services/getArticleById.js";
import getArticleList from "./services/getArticleList.js";
import patchArticle from "./services/patchArticle.js";
import postNewArticle from "./services/postNewArticle.js";

const router = express.Router();

router.post("/", postNewArticle);
router.get("/:id", getArticleById);
router.patch("/:id", patchArticle);
router.delete("/:id", deleteArticle);
router.get("/", getArticleList);

export default router;
