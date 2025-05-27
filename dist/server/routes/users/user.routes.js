"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controllers/user.controller");
const authHandler_1 = require("../../middlewares/authHandler");
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const router = express_1.default.Router();
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
router.get("/me", authHandler_1.validateUser, (0, asyncHandler_1.default)(user_controller_1.getUserById));
exports.default = router;
