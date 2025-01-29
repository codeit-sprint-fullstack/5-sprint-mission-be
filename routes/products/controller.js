import express from "express";
import deleteProduct from "./service/deleteProduct.js";
import getProductById from "./service/getProductById.js";
import getProductsList from "./service/getProductsList.js";
import patchProduct from "./service/patchProduct.js";
import postNewProduct from "./service/postNewProduct.js";

const router = express.Router();

router.get("/:id", getProductById);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProductsList);
router.post("/", postNewProduct);

export default router;
