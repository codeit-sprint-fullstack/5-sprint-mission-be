"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_controller_1 = require("../../controllers/articles.controller");
const validate_1 = require("../../middlewares/validate");
const authHandler_1 = require("../../middlewares/authHandler");
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const comments_controller_1 = require("../../controllers/comments.controller");
const favorites_controller_1 = require("../../controllers/favorites.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 게시글 관련 API
 */
/**
 * @swagger
 * /articles:
 *   post:
 *     summary: 게시글 작성
 *     tags: [Article]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: 게시글 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 */
router.post("/", authHandler_1.validateUser, validate_1.upload.array("images", 3), (0, asyncHandler_1.default)(articles_controller_1.createArticle));
/**
 * @swagger
 * /articles:
 *   get:
 *     summary: 모든 게시글 조회
 *     tags: [Article]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           enum: [recent, favorites]
 *           default: recent
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 */
router.get("/", (0, asyncHandler_1.default)(articles_controller_1.getArticles));
/**
 * @swagger
 * /articles/{articleId}:
 *   get:
 *     summary: 특정 게시글 조회
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.get("/:id", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("id"), (0, asyncHandler_1.default)(articles_controller_1.getArticle));
/**
 * @swagger
 * /articles/{articleId}:
 *   patch:
 *     summary: 게시글 수정
 *     tags: [Article]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.patch("/:id", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("id"), validate_1.upload.array("images", 3), (0, asyncHandler_1.default)(articles_controller_1.updateArticle));
/**
 * @swagger
 * /articles/{articleId}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Article]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 게시글 삭제 성공
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.delete("/:id", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("id"), (0, asyncHandler_1.default)(articles_controller_1.deleteArticle));
/**
 * @swagger
 * /articles/{articleId}/favorite:
 *   put:
 *     summary: 게시글 좋아요 추가
 *     tags: [Article]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 좋아요 추가 성공
 *       400:
 *         description: 이미 좋아요한 경우
 */
router.put("/:articleId/favorite", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("articleId"), (0, asyncHandler_1.default)(favorites_controller_1.addFavorite));
/**
 * @swagger
 * /articles/{articleId}/favorite:
 *   delete:
 *     summary: 게시글 좋아요 취소
 *     tags: [Article]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *       404:
 *         description: 이미 좋아요가 취소됨
 */
router.delete("/:articleId/favorite", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("articleId"), (0, asyncHandler_1.default)(favorites_controller_1.removeFavorite));
/**
 * @swagger
 * /articles/{articleId}/comments:
 *   post:
 *     summary: 게시글에 댓글 작성
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 댓글 작성 성공
 *       400:
 *         description: 유효하지 않은 댓글 내용
 */
router.post("/:articleId/comments", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("articleId"), (0, asyncHandler_1.default)(comments_controller_1.addComment));
/**
 * @swagger
 * /articles/{articleId}/comments:
 *   get:
 *     summary: 게시글의 모든 댓글 조회
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 */
router.get("/:articleId/comments", (0, validate_1.checkUUIDParams)("articleId"), (0, asyncHandler_1.default)(comments_controller_1.getComments));
exports.default = router;
