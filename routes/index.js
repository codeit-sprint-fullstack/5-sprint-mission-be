import express from "express";
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsList,
} from "../controllers/index.js";

const router = express.Router();

router.get("/products", getProductsList);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
