import express from "express";
import sharedCommentService from "./service.js";
import authMiddleware from "../../../middlewares/auth.js";

const router = express.Router();

router.get("/:domainId", sharedCommentService.getComments);

// 인증 필요
router.post(
  "/:domainId",
  authMiddleware.verifyToken,
  sharedCommentService.createComment
);
router.patch(
  "/:id",
  authMiddleware.verifyToken,
  sharedCommentService.patchComment
);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  sharedCommentService.deleteComment
);

export default router;
