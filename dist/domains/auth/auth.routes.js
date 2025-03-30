"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
// import { authenticateJWT } from "../../middlewares/auth.middleware";
const router = express_1.default.Router();
// 회원가입
router.post("/signup", auth_controller_1.signUp);
// 로그인
router.post("/signin", auth_controller_1.signIn);
// 토큰 갱신
router.post("/refresh-token", auth_controller_1.refreshAccessToken);
// 인증 확인 (인증된 사용자만 접근 가능)
// router.get("/verify", authenticateJWT, verifyAuth);
// // 비밀번호 변경 (인증된 사용자만 접근 가능)
// router.put("/password", authenticateJWT, changePassword);
exports.default = router;
