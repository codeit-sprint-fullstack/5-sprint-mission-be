import express from "express";
import productsRouter from "./products/controller.js";
import boardRouter from "./board/controller.js";

const router = express.Router();

router.use("/products", productsRouter);
router.use("/board", boardRouter);

export default router;
