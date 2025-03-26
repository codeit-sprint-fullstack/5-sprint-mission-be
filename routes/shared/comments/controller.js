import express from "express";
import sharedCommentService from "./service.js";
import authMiddleware from "../../../middlewares/auth.js";

const router = express.Router();

router.get("/:domainId", sharedCommentService.getComments);

// 댓글 목록 조회 제외한 모든 라우트에 verifyToken 미들웨어 적용
router.use(authMiddleware.verifyToken);

router.post("/:domainId", sharedCommentService.createComment);
router.patch("/:id", sharedCommentService.patchComment);
router.delete("/:id", sharedCommentService.deleteComment);

export default router;
