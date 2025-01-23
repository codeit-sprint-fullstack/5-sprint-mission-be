import express from "express";
import service from "./service.js";

const router = express.Router();

router.get("/", service.getProductList);
router.get("/:id", service.getProduct);
router.post("/", service.createProduct);
router.patch("/:id", service.patchProduct);
router.delete("/:id", service.deleteProduct);

export default router;
