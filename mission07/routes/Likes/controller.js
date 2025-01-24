import express from "express";
import { createProductLikes, deleteProductLikes } from "./productService.js";
import { createArticleLikes, deleteArticleLikes } from "./articleService.js";

const router = express.Router();

router.post("/product", createProductLikes);
router.delete("/product", deleteProductLikes);

router.post("/article", createArticleLikes);
router.delete("/article", deleteArticleLikes);

export default router;
