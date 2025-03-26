import express from "express";
import service from "./service.js";
import authMiddleware from "../../middlewares/auth.js";

const router = express.Router();

// 모든 라우트에 verifyToken 미들웨어 적용
router.use(authMiddleware.verifyToken);

router.get("/", service.getArticleList);
router.get("/:id", service.getArticle);
router.post("/", service.createArticle);
router.patch("/:id", service.patchArticle);
router.delete("/:id", service.deleteArticle);
// router.post("/:id/like", service.createLike);
// router.delete("/:id/like", service.deleteLike);

export default router;
