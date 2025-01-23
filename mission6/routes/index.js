import express from "express";
import productsRouter from "./products/controller.js";

const router = express.Router();

//TODO: 이후 articles 라우터 추가될 예정
router.use("/products", productsRouter);

export default router;
