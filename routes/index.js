import express from "express";
import productRouter from "./product/index.js";

const router = express();

router.use("/products", productRouter);

export default router;
