import express from "express";
import productsRouter from "./products/controller.js";
import articlesRouter from "./articles/controller.js";

const router = express.Router();

router.use("/products", productsRouter);
router.use("/articles", articlesRouter);

export default router;
