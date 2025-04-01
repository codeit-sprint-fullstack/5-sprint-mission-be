import { Router } from "express";
import {
  addProductComment,
  getProductCommentList,
  updateComment,
  deleteComment,
} from "./comment.controller";
import { authenticateJWT } from "../../middleware/auth.middleware";
const router = Router({ mergeParams: true });
router.get("/", getProductCommentList);
router.post("/", authenticateJWT, addProductComment);
router.delete("/:id", authenticateJWT, deleteComment);
router.patch("/:id", authenticateJWT, updateComment);

export default router;
