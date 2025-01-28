import express from "express";
import service from "./service.js";

const router = express.Router();

router.get("/:id", service.getProductById);
router.patch("/:id", service.patchProduct);
router.delete("/:id", service.deleteProduct);
router.get("/", service.getProductsList);

export default router;
