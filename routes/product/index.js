import express from "express";
import productController from "./controller/product.controller.js";

const router = express();

router.post("/", productController.addProduct);

export default router;
