import express from "express";
import { getUserById } from "../../controllers/user.controller.js";
import { checkUUID } from "../../middlewares/validateParams.js";
import { validateUser } from "../../middlewares/authHandler.js";
import asyncHandler from "../../middlewares/asyncHandler.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 사용자 ID
 *                 email:
 *                   type: string
 *                   description: 사용자 이메일
 *                 nickname:
 *                   type: string
 *                   description: 사용자 닉네임
 *                 image:
 *                   type: string
 *                   description: 사용자 프로필 이미지 URL
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 사용자 생성 시각
 *       401:
 *         description: 인증 실패. 유효한 JWT가 필요합니다.
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.get("/me/:id", validateUser, checkUUID, asyncHandler(getUserById));

export default router;
