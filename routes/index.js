import express from "express";
import productsRouter from "./products/controller.js";
import articlesRouter from "./articles/controller.js";
import sharedCommentsRouter from "./shared/comments/controller.js";

const router = express.Router();

router.use("/products", productsRouter);
router.use("/articles", articlesRouter);
router.use("/comments", sharedCommentsRouter);

export default router;
