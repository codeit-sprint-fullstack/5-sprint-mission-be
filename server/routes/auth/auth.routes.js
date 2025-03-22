import express from "express";
import asyncHandler from "../../middlewares/asyncHandler.js";
import {
  googleLogin,
  login,
  refreshToken,
  signUp,
} from "../../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자의 이메일
 *                 example: "user@example.com"
 *               nickname:
 *                 type: string
 *                 description: 사용자의 닉네임
 *                 example: "panda123"
 *               password:
 *                 type: string
 *                 description: 사용자의 비밀번호
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: 생성된 사용자 ID
 *       400:
 *         description: 잘못된 입력 형식
 *       409:
 *         description: 이미 존재하는 이메일
 */
router.post("/signup", asyncHandler(signUp));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자의 이메일
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: 사용자의 비밀번호
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT 토큰
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 사용자 ID
 *                     email:
 *                       type: string
 *                       description: 사용자 이메일
 *                     nickname:
 *                       type: string
 *                       description: 사용자 닉네임
 *       400:
 *         description: 잘못된 이메일 또는 비밀번호
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.post("/login", asyncHandler(login));

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: 구글 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: 구글 로그인 토큰
 *     responses:
 *       200:
 *         description: 구글 로그인 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post("/google", asyncHandler(googleLogin));

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 새로운 액세스 토큰 발급 성공
 *       401:
 *         description: 리프레시 토큰이 유효하지 않거나 만료되었습니다.
 */
router.post("/refresh-token", asyncHandler(refreshToken));

export default router;
