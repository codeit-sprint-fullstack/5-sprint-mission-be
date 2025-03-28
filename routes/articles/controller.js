import express from "express";
import service from "./service.js";
import authMiddleware from "../../middlewares/auth.js";
import { handleImageUpload } from "../../middlewares/imageUploadHandler.js";

const router = express.Router();

// 모든 라우트에 verifyToken 미들웨어 적용
router.use(authMiddleware.verifyToken);

router.get("/", service.getArticleList);
router.get("/:id", service.getArticle);
router.delete("/:id", service.deleteArticle);
router.post("/:id/like", service.createLike);
router.delete("/:id/like", service.deleteLike);

// 게시글 등록, 수정 - 이미지 업로드 미들웨어 적용
router.post("/", handleImageUpload, service.createArticle);
router.patch("/:id", handleImageUpload, service.patchArticle);

export default router;
