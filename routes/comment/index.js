import express from "express";
import commentController from "./controller/comment.controller.js";

const router = express();

router.get("/", commentController.fetchCommentList);
router.post("/", commentController.addComment);
router.patch("/", commentController.modifyComment);
router.delete("/:id", commentController.removeComment);

export default router;
