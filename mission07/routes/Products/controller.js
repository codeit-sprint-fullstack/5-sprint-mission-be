import express from "express";
import {
  getProductList,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./service.js";

const router = express.Router();

router.get("/", getProductList);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
