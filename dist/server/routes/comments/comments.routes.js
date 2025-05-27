"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authHandler_1 = require("../../middlewares/authHandler");
const validate_1 = require("../../middlewares/validate");
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const comments_controller_1 = require("../../controllers/comments.controller");
const router = express_1.default.Router();
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
router.patch("/:commentId", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("commentId"), (0, asyncHandler_1.default)(comments_controller_1.updateComment));
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
router.delete("/:commentId", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("commentId"), (0, asyncHandler_1.default)(comments_controller_1.deleteComment));
exports.default = router;
