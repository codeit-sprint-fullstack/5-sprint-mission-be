import express from "express";
import deleteProduct from "./services/deleteProduct.js";
import getProductById from "./services/getProductById.js";
import getProductList from "./services/getProductList.js";
import patchProduct from "./services/patchProduct.js";
import postNewProduct from "./services/postNewProduct.js";
import postProductComment from "./services/postProductComment.js";
import getProductCommentList from "./services/getProductCommentList.js";
import patchProductComment from "./services/patchProductComment.js";
import deleteProductComment from "./services/deleteProductComment.js";

const router = express.Router();

router.get("/:id", getProductById);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProductList);
router.post("/", postNewProduct);

// 댓글
router.post(":productId/comments", postProductComment);
router.get(":productId/comments", getProductCommentList);
router.patch("/:productId/comments/:commentId", patchProductComment);
router.delete("/:productId/comments/:commentId", deleteProductComment);

export default router;
