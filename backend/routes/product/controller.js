import express from "express";
import service from "./service.js";

const router = express.Router();

//1. 상품 등록 API를 만들어 주세요.
router.post("/", service.postProduct);
//2. 상품 상세 조회 API를 만들어 주세요.
router.get("/:id", service.getProduct);
//3. 상품 수정 API를 만들어 주세요.
router.patch("/:id", service.patchProduct);
//4. 상품 삭제 API를 만들어 주세요.
router.delete("/:id", service.deleteProduct);
//5. 상품 목록 조회 API를 만들어 주세요.
router.get("/", service.getProductList);

export default router;
