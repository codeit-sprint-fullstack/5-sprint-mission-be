import express from "express";
import sharedCommentService from "./service.js";
import authMiddleware from "../../../middlewares/auth.js";

const router = express.Router();

// 모든 라우트에 verifyToken 미들웨어 적용
router.use(authMiddleware.verifyToken);

router.get("/:domainId", sharedCommentService.getComments);
router.post("/:domainId", sharedCommentService.createComment);
router.patch("/:id", sharedCommentService.patchComment);
router.delete("/:id", sharedCommentService.deleteComment);

export default router;
