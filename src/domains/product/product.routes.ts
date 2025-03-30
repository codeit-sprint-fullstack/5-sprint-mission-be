import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  addFavorite,
  removeFavorite,
  updateProduct,
  deleteProduct,
} from "./product.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/multerConfig";
import commentRouter from "../comment/comment.routes";
const router = Router();

// TODO: user 로직 만들어야함
router.get("/", getProducts);
router.post("/", upload.array("images", 3), authenticateJWT, createProduct);
router.get("/:id", getProductById);
router.post("/:id/favorite", authenticateJWT, addFavorite);
router.delete("/:id/favorite", authenticateJWT, removeFavorite);
router.patch("/:id", upload.array("images", 3), authenticateJWT, updateProduct);
router.delete("/:id", authenticateJWT, deleteProduct);

router.use("/:id/comments", commentRouter);
export default router;
