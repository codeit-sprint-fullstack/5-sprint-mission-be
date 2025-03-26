import express from "express";
import service from "./service.js";
import authMiddleware from "../../middlewares/auth.js";
import createProductMiddleware from "../../middlewares/createProduct.js";

const router = express.Router();

router.get("/", service.getProductList);
router.get("/:id", service.getProduct);

// 인증 필요
// 상품 등록 - 이미지 업로드 + 유효성 검사 미들웨어 적용
router.post(
  "/",
  authMiddleware.verifySessionLogin,
  createProductMiddleware.verifyProductFields,
  createProductMiddleware.handleImageUpload,
  service.createProduct
);
// 상품 수정 - 이미지 업로드 + 유효성 검사 미들웨어 적용
router.patch(
  "/:id",
  authMiddleware.verifySessionLogin,
  createProductMiddleware.verifyProductFields,
  createProductMiddleware.handleImageUpload,
  service.patchProduct
);
router.delete("/:id", authMiddleware.verifySessionLogin, service.deleteProduct);
router.post("/:id/like", authMiddleware.verifySessionLogin, service.createLike);
router.delete(
  "/:id/like",
  authMiddleware.verifySessionLogin,
  service.deleteLike
);

export default router;
