import express from "express";
import deleteProduct from "./services/deleteProduct.js";
import getProductById from "./services/getProductById.js";
import getProductList from "./services/getProductList.js";
import patchProduct from "./services/patchProduct.js";
import postNewProduct from "./services/postNewProduct.js";

const router = express.Router();

router.get("/:id", getProductById);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProductList);
router.post("/", postNewProduct);

export default router;
