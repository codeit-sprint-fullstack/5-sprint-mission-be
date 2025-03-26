import express from "express";
import service from "./service.js";
import authMiddleware from "../../middlewares/auth.js";
import createProductMiddleware from "../../middlewares/createProduct.js";

const router = express.Router();

// 모든 라우트에 verifyToken 미들웨어 적용
router.use(authMiddleware.verifyToken);

router.get("/", service.getProductList);
router.get("/:id", service.getProduct);
// 상품 등록 - 이미지 업로드 + 유효성 검사 미들웨어 적용
router.post(
  "/",
  createProductMiddleware.handleImageUpload,
  createProductMiddleware.verifyProductFields,
  service.createProduct
);
// 상품 수정 - 이미지 업로드 + 유효성 검사 미들웨어 적용
router.patch(
  "/:id",
  createProductMiddleware.handleImageUpload,
  createProductMiddleware.verifyProductFields,
  service.patchProduct
);
router.delete("/:id", service.deleteProduct);
router.post("/:id/like", service.createLike);
router.delete("/:id/like", service.deleteLike);

export default router;
