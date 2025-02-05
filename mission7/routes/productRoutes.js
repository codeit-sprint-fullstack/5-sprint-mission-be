import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// 상품 등록 (Create)
router.post("/", productController.createProduct);

// 상품 목록 조회 (Read - 전체)
router.get("/", productController.getProducts);

// 상품 상세 조회 (Read - 단일)
router.get("/:id", productController.getProductById);

// 상품 수정 (Update)
router.patch("/:id", productController.updateProduct);

// 상품 삭제 (Delete)
router.delete("/:id", productController.deleteProduct);

// 상품 좋아요 토글 기능
// 상품의 좋아요를 추가하거나 취소합니다.
router.patch("/:id/like", productController.toggleLike);

export default router;
