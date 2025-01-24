import express from "express";
import {
  getProductList,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./service.js";
import { verifyToken } from "../../middleware/index.js";

const router = express.Router();

router.get("/", getProductList);
router.get("/:id", getProduct);
router.post("/", verifyToken, createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
