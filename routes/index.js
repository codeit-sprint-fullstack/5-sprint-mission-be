import express from "express";
import productRouter from "./product/index.js";
import articleRouter from "./article/index.js";

const router = express();

router.use("/products", productRouter);
router.use("/articles", articleRouter);

export default router;
