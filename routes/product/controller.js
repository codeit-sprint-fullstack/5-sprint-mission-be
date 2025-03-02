import express from "express";
import service from "./service.js";

const router = express.Router();

router.get("/", service.getProductList);
router.post("/",service.postProduct);
router.get("/:id",service.getProduct);
router.patch("/:id",service.patchProduct);
router.delete("/:id",service.deleteProduct);

export default router;