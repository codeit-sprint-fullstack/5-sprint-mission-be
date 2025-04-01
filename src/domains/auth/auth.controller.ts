import { NextFunction, Request, Response } from "express";
import {
  createUser,
  authenticateUser,
  logoutUser,
  refreshToken,
} from "./auth.service";
import {
  TokenPayload,
  AuthenticatedRequest,
} from "../../middleware/auth.middleware";
import errorHandler from "@/middleware/errorHandler";
import CustomError from "@/types/error";
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: 사용자 인증 관련 API
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일
 *                 example: "panda@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 비밀번호
 *                 example: "password"
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *               image:
 *                 type: string
 *                 description: 프로필 이미지 URL
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User signed up successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     image:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       409:
 *         description: 중복된 이메일 또는 닉네임
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이미 존재하는 이메일입니다.
 *                 field:
 *                   type: string
 *                   enum: [email, nickname]
 *                   example: email
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원가입 실패
 */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, nickname, image } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요" });
      return;
    }
    // 비밀번호 복잡성 검증
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "비밀번호는 최소 8자 이상이며, 영문자와 숫자를 포함해야 합니다.",
      });
      return;
    }

    const newUser = await createUser(email, password, nickname, image);

    res.status(201).json({
      message: "회원가입 성공",
      user: newUser,
    });
  } catch (error) {
    next(error);

    // 오류 메시지 추출
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 이메일 중복 메시지
    if (errorMessage === "Email already exists") {
      res.status(409).json({
        message: "이미 존재하는 이메일입니다.",
      });
      return;
    }

    // 닉네임 중복 메시지
    if (errorMessage === "Nickname already exists") {
      res.status(409).json({
        message: "이미 존재하는 닉네임입니다.",
      });
      return;
    }
    next(error); // 다른 오류는 errorHandler로
  }
};

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: 로그인
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일
 *                 example: "panda@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 비밀번호
 *                 example: "password"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT 액세스 토큰
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nickname:
 *                       type: string
 *       401:
 *         description: 로그인 실패 - 잘못된 인증 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       404:
 *         description: 로그인 실패 - 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login failed
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요" });
      return;
    }

    // 사용자 인증
    const { accessToken, refreshToken, user } = await authenticateUser(
      email,
      password
    );

    // 쿠키에 리프레시 토큰 설정
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // 디버깅 로그
    console.log(`✅ 로그인 성공: ${user.email} (${user.id})`);

    // 응답
    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    // 인증 실패 시
    if (
      error instanceof Error &&
      (error.message === "User not found" ||
        error.message === "Invalid credentials")
    ) {
      // 모든 인증 실패에 대해 동일한 메시지 사용 (사용자 존재 여부 노출 방지)
      res.status(401).json({
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
      return;
    }

    next(error);
  }
};

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: 액세스 토큰 갱신
 *     tags: [Authentication]
 *     description: 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: 새로 발급된 JWT 액세스 토큰
 *       401:
 *         description: 리프레시 토큰 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token not found
 *       403:
 *         description: 유효하지 않은 리프레시 토큰
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired refresh token
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refresh failed
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      res.status(401).json({ message: "Refresh token not found" });
      return;
    }

    try {
      // refreshToken 서비스 함수 호출
      const { accessToken } = await refreshToken(refreshTokenFromCookie);

      // 새 액세스 토큰 반환
      res.status(200).json({ accessToken });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid token";
      console.error(`Refresh token validation failed: ${errorMessage}`);
      res.status(403).json({ message: errorMessage });
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Token refresh failed with error: ${errorMessage}`);
    res.status(500).json({ message: "Token refresh failed" });
  }
};
function next(error: unknown) {
  throw new Error("Function not implemented.");
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Auths:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - refreshToken
 *         - expiredAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 인증 정보의 고유 식별자
 *           example: 3f8d1e94-7c51-4d8a-9d0b-a2bc3e4f5678
 *         userId:
 *           type: string
 *           format: uuid
 *           description: 인증 정보와 연결된 사용자의 ID
 *           example: 2e388cc5-8421-4cd3-98f7-befdb6d3b675
 *         refreshToken:
 *           type: string
 *           description: JWT 리프레시 토큰 (고유값)
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTM4OGNjNS04NDIxLTRjZDMtOThmNy1iZWZkYjZkM2I2NzUiLCJpYXQiOjE2OTM0NTY3ODksImV4cCI6MTY5NDA2MTU4OX0.jN5dL4D8MQQdOx5-DmEyfV5fsFB6Qdqo0NfzxjC9X9I
 *         expiredAt:
 *           type: string
 *           format: date-time
 *           description: 리프레시 토큰 만료 시간
 *           example: 2025-03-30T10:15:30Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 인증 정보 생성 시간
 *           example: 2025-03-30T10:15:30Z
 */
