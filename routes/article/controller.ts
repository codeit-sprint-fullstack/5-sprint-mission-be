import express, { Router } from "express";
import service from "./service.ts";
import auth from "../../middleware/auth.ts";

const router: Router = express.Router();

router.get("/", service.getArticleList);
router.post("/", auth.verifyAccessToken, service.postArticle);
router.patch("/:id", auth.verifyAccessToken,auth.verifyArticleChange, service.patchArticle);
router.get("/:id", service.getArticle);
router.delete("/:id", auth.verifyAccessToken,auth.verifyArticleChange, service.deleteArticle);

export default router;
