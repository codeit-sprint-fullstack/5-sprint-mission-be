import express from "express";
import articleRoutes from "./articles/articles.routes.js";
import productRoutes from "./products/products.routes.js";
import commentsRoutes from "./comments/comments.routes.js";
import userRoutes from "./users/user.routes.js";
import authRoutes from "./auth/auth.routes.js";

const router = express.Router();

router.use("/articles", articleRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/comments", commentsRoutes);

export default router;
