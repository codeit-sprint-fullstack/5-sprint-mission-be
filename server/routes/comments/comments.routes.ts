import express from "express";
import { validateUser } from "../../middlewares/authHandler";
import { checkUUIDParams } from "../../middlewares/validate";
import asyncHandler from "../../middlewares/asyncHandler";
import {
  deleteComment,
  updateComment,
} from "../../controllers/comments.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 댓글 API
 */

/**
 * @swagger
 * /comments/{commentId}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *       403:
 *         description: 본인 댓글만 수정 가능
 *       404:
 *         description: 댓글을 찾을 수 없음
 *
 */
router.patch(
  "/:commentId",
  validateUser,
  checkUUIDParams("commentId"),
  asyncHandler(updateComment)
);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 댓글 ID
 *     responses:
 *       204:
 *         description: 댓글 삭제 성공
 *       403:
 *         description: 본인 댓글만 삭제 가능
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
router.delete(
  "/:commentId",
  validateUser,
  checkUUIDParams("commentId"),
  asyncHandler(deleteComment)
);

export default router;
