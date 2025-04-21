import express, { Router } from "express";
import service from "./service";
import authMiddleware from "../../middlewares/auth";
import { handleImageUpload } from "../../middlewares/imageUploadHandler";

const router: Router = express.Router();

// 목록 조회와 상세 조회는 선택적 인증 적용
router.get("/", authMiddleware.optionalVerifyToken, service.getArticleList);
router.get("/:id", authMiddleware.optionalVerifyToken, service.getArticle);

// 나머지 라우트에 필수 인증 미들웨어 적용
router.use("*", authMiddleware.verifyToken);

router.delete("/:id", service.deleteArticle);
router.post("/:id/like", service.createLike);
router.delete("/:id/like", service.deleteLike);

// 게시글 등록, 수정 - 이미지 업로드 미들웨어 적용
router.post("/", handleImageUpload, service.createArticle);
router.patch("/:id", handleImageUpload, service.patchArticle);

export default router;
