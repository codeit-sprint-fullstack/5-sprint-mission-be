"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.signIn = exports.signUp = void 0;
const auth_service_1 = require("./auth.service");
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
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                message: "비밀번호는 최소 8자 이상이며, 영문자와 숫자를 포함해야 합니다.",
            });
            return;
        }
        const newUser = yield (0, auth_service_1.createUser)(email, password, nickname, image);
        res.status(201).json({
            message: "회원가입 성공",
            user: newUser,
        });
    }
    catch (error) {
        next(error);
        // 오류 메시지 추출
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
});
exports.signUp = signUp;
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
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 필수 필드 검증
        if (!email || !password) {
            res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요" });
            return;
        }
        // 사용자 인증
        const { accessToken, refreshToken, user } = yield (0, auth_service_1.authenticateUser)(email, password);
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
    }
    catch (error) {
        console.error("Login error:", error);
        // 인증 실패 시
        if (error instanceof Error &&
            (error.message === "User not found" ||
                error.message === "Invalid credentials")) {
            // 모든 인증 실패에 대해 동일한 메시지 사용 (사용자 존재 여부 노출 방지)
            res.status(401).json({
                message: "이메일 또는 비밀번호가 올바르지 않습니다.",
            });
            return;
        }
        next(error);
    }
});
exports.signIn = signIn;
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
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken;
        if (!refreshTokenFromCookie) {
            res.status(401).json({ message: "Refresh token not found" });
            return;
        }
        try {
            // refreshToken 서비스 함수 호출
            const { accessToken } = yield (0, auth_service_1.refreshToken)(refreshTokenFromCookie);
            // 새 액세스 토큰 반환
            res.status(200).json({ accessToken });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Invalid token";
            console.error(`Refresh token validation failed: ${errorMessage}`);
            res.status(403).json({ message: errorMessage });
        }
    }
    catch (error) {
        console.error("Token refresh error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Token refresh failed with error: ${errorMessage}`);
        res.status(500).json({ message: "Token refresh failed" });
    }
});
exports.refreshAccessToken = refreshAccessToken;
function next(error) {
    throw new Error("Function not implemented.");
}
