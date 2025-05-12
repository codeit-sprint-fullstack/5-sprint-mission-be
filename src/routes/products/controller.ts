import express, { Router } from "express";
import service from "./service";
import authMiddleware from "../../middlewares/auth";
import { handleImageUpload } from "../../middlewares/imageUploadHandler";
import { verifyProductFields } from "../../middlewares/verifyProductFields";

const router: Router = express.Router();

// 목록 조회와 상세 조회는 선택적 인증 적용
router.get("/", authMiddleware.optionalVerifyToken, service.getProductList);
router.get("/:id", authMiddleware.optionalVerifyToken, service.getProduct);

// 나머지 라우트에 필수 인증 미들웨어 적용
router.use(authMiddleware.verifyToken);

router.delete("/:id", service.deleteProduct);
router.post("/:id/like", service.createLike);
router.delete("/:id/like", service.deleteLike);

// 상품 등록, 수정 - 이미지 업로드, 유효성 검사 미들웨어 적용
router.post("/", handleImageUpload, verifyProductFields, service.createProduct);
router.patch(
  "/:id",
  handleImageUpload,
  verifyProductFields,
  service.patchProduct
);

export default router;
