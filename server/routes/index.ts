import express from "express";
import articleRoutes from "./articles/articles.routes";
import productRoutes from "./products/products.routes";
import commentsRoutes from "./comments/comments.routes";
import userRoutes from "./users/user.routes";
import authRoutes from "./auth/auth.routes";

const router = express.Router();

router.use("/articles", articleRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/comments", commentsRoutes);

export default router;
