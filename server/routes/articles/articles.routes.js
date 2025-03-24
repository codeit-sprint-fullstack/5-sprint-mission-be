import express from "express";
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../controllers/articles.controller.js";
import { checkUUID } from "../../middlewares/validateParams.js";
import { validateUser } from "../../middlewares/authHandler.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import {
  addComment,
  getComments,
} from "../../controllers/comments.controller.js";
import {
  addFavorite,
  removeFavorite,
} from "../../controllers/favorites.controller.js";

const router = express.Router();

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
 *                 example: https://example.com/....
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
 *                   description: 게시글 ID
 *                 title:
 *                   type: string
 *                   description: 게시글 제목
 *                 content:
 *                   type: string
 *                   description: 게시글 내용
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 image:
 *                   type: string
 *                   format: uri
 *                   example: https://example.com/....
 */
router.post("/", validateUser, ...createArticle);

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
 *         description: 검색어
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           enum: [recent, favorites]
 *           default: recent
 *         description: 정렬 기준
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: 페이지네이션을 위한 커서 (마지막 게시글 ID)
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 가져올 게시글 개수 (정수만)
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       favoriteCount:
 *                         type: integer
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 */
router.get("/", asyncHandler(getArticles));

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
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 게시글 ID
 *                 title:
 *                   type: string
 *                   description: 게시글 제목
 *                 content:
 *                   type: string
 *                   description: 게시글 내용
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.get("/:id", validateUser, checkUUID, asyncHandler(getArticle));

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
 *         description: 게시글 ID
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
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 게시글 ID
 *                 title:
 *                   type: string
 *                   description: 게시글 제목
 *                 content:
 *                   type: string
 *                   description: 게시글 내용
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       403:
 *         description: 수정 권한 없음
 */
router.patch("/:id", validateUser, checkUUID, ...updateArticle);

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
 *         description: 게시글 ID
 *     responses:
 *       204:
 *         description: 게시글 삭제 성공
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       403:
 *         description: 삭제 권한 없음
 */
router.delete("/:id", validateUser, checkUUID, asyncHandler(deleteArticle));

/**
 * @swagger
 * /articles/{articleId}/favorite:
 *   post:
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
 *         description: 게시글 ID
 *     responses:
 *       201:
 *         description: 좋아요 추가 성공
 *       400:
 *         description: 이미 좋아요한 경우
 */
router.put(
  "/:articleId/favorite",
  validateUser,
  checkUUID,
  asyncHandler(addFavorite)
);

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
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *       404:
 *         description: 이미 좋아요한 경우
 */
router.delete(
  "/:articleId/favorite",
  validateUser,
  checkUUID,
  asyncHandler(removeFavorite)
);

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
 *         description: 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *                 example: "좋은 게시글입니다!"
 *               userId:
 *                 type: string
 *                 description: 댓글 작성자 ID (로그인된 사용자의 ID)
 *                 example: "user123"
 *               articleId:
 *                 type: string
 *                 description: 게시글 ID (상품 댓글일 경우 productId 사용)
 *                 example: "article456"
 *             required:
 *               - content
 *               - userId
 *     responses:
 *       201:
 *         description: 댓글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 댓글 ID
 *                 content:
 *                   type: string
 *                   description: 댓글 내용
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 댓글 생성 시각
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 댓글 작성자 ID
 *                     nickname:
 *                       type: string
 *                       description: 댓글 작성자 닉네임
 *       400:
 *         description: 댓글 내용이 비어 있음
 *       404:
 *         description: 게시글 또는 상품을 찾을 수 없음
 */
router.post(
  "/:articleId/comments",
  validateUser,
  checkUUID,
  asyncHandler(addComment)
);

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
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nickname:
 *                         type: string
 */
router.get("/:articleId/comments", checkUUID, asyncHandler(getComments));

export default router;
