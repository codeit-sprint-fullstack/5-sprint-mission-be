import express from "express";
import { getUserById } from "../../controllers/user.controller";
import { validateUser } from "../../middlewares/authHandler";
import asyncHandler from "../../middlewares/asyncHandler";

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
 *                 email:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: 인증 실패. 유효한 JWT가 필요합니다.
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.get("/me", validateUser, asyncHandler(getUserById));

export default router;
