import express from "express";
import productRoutes from "./products.js";
import articleRoutes from "./articles.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/articles", articleRoutes);

export default router;
