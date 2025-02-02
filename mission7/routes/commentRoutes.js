import express from "express";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

// PATCH /api/comments/:id - 댓글 수정
router.patch("/:id", commentController.updateComment);

// DELETE /api/comments/:id - 댓글 삭제
router.delete("/:id", commentController.deleteComment);

export default router;
