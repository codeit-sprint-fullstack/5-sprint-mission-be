import express from "express";
import AuthRouter from "./auth/controller.js";
import ProductsRouter from "./products/controller.js";
import ArticlesRouter from "./articles/controller.js";
import CommentsRouter from "./shared/comments/controller.js";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/products", ProductsRouter);
router.use("/articles", ArticlesRouter);
router.use("/comments", CommentsRouter);

export default router;
