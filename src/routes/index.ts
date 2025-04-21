import express from "express";
import AuthRouter from "./auth/controller";
import ProductsRouter from "./products/controller";
import ArticlesRouter from "./articles/controller";
import CommentsRouter from "./shared/comments/controller";

const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/products", ProductsRouter);
router.use("/articles", ArticlesRouter);
router.use("/comments", CommentsRouter);

export default router;
