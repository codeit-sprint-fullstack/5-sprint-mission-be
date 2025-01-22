import express from "express";
import productController from "./controller/product.controller.js";

const router = express();

router.get("/", productController.fetchProductList);
router.post("/", productController.addProduct);

export default router;
