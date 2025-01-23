import express from "express";
import sharedCommentService from "./service.js";

const router = express.Router();

router.get("/:domainId", sharedCommentService.getComments);
router.post("/:domainId", sharedCommentService.createComment);
router.patch("/:id", sharedCommentService.patchComment);
router.delete("/:id", sharedCommentService.deleteComment);

export default router;
