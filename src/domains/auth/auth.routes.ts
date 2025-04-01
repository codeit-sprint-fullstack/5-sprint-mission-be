import express from "express";
import {
  signUp,
  signIn,
  refreshAccessToken,
  // verifyAuth,
  // changePassword,
} from "./auth.controller";
// import { authenticateJWT } from "../../middlewares/auth.middleware";

const router = express.Router();

// 회원가입
router.post("/signup", signUp);

// 로그인
router.post("/signin", signIn);

// 토큰 갱신
router.post("/refresh-token", refreshAccessToken);

// 인증 확인 (인증된 사용자만 접근 가능)
// router.get("/verify", authenticateJWT, verifyAuth);

// // 비밀번호 변경 (인증된 사용자만 접근 가능)
// router.put("/password", authenticateJWT, changePassword);

export default router;
