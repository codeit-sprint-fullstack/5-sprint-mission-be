import express from "express";
import service from "./service.js";
import authMiddleware from "../../middlewares/auth.js";
import { handleImageUpload } from "../../middlewares/imageUploadHandler.js";
import { verifyProductFields } from "../../middlewares/verifyProductFields.js";

const router = express.Router();

// 모든 라우트에 verifyToken 미들웨어 적용
router.use(authMiddleware.verifyToken);

router.get("/", service.getProductList);
router.get("/:id", service.getProduct);
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
