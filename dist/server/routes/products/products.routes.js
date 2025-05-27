"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("../../controllers/products.controller");
const authHandler_1 = require("../../middlewares/authHandler");
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const comments_controller_1 = require("../../controllers/comments.controller");
const favorites_controller_1 = require("../../controllers/favorites.controller");
const validate_1 = require("../../middlewares/validate");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: 상품 관련 API
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품 이름
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *               price:
 *                 type: number
 *                 description: 상품 가격
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 상품 이미지 URL들
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 상품 태그들
 *     responses:
 *       201:
 *         description: 상품 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 상품 ID
 *                 name:
 *                   type: string
 *                   description: 상품 이름
 *                 description:
 *                   type: string
 *                   description: 상품 설명
 *                 price:
 *                   type: number
 *                   description: 상품 가격
 *                 imageUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 상품 이미지 URL들
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 상품 태그들
 *       400:
 *         description: 잘못된 입력 형식
 */
router.post("/", authHandler_1.validateUser, validate_1.upload.array("images", 3), (0, asyncHandler_1.default)(products_controller_1.createProduct));
/**
 * @swagger
 * /products:
 *   get:
 *     summary: 모든 상품 조회
 *     tags: [Product]
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
 *         description: 페이지네이션을 위한 커서 (마지막 상품 ID)
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 가져올 상품 개수 (정수만)
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 상품 ID
 *                   name:
 *                     type: string
 *                     description: 상품 이름
 *                   description:
 *                     type: string
 *                     description: 상품 설명
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: 상품 가격
 *                   imageUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: 상품 이미지 URL들
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: 상품 태그들
 *                   createdAt:
 *                         type: string
 *                         format: date-time
 *                   updatedAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/", (0, asyncHandler_1.default)(products_controller_1.getProducts));
/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 상품 ID
 *                 name:
 *                   type: string
 *                   description: 상품 이름
 *                 description:
 *                   type: string
 *                   description: 상품 설명
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: 상품 가격
 *                 imageUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 상품 이미지 URL들
 *                 tags:
 *                   type: array
 *                   items:
 *                      type: string
 *                   description: 상품 태그들
 *                 createdAt:
 *                      type: string
 *                      format: date-time
 *                 updatedAt:
 *                      type: string
 *                      format: date-time
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.get("/:id", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("id"), (0, asyncHandler_1.default)(products_controller_1.getProduct));
/**
 * @swagger
 * /products/{productId}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품 이름
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *               price:
 *                 type: number
 *                 description: 상품 가격
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 상품 이미지 URL들
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 상품 태그들
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 상품 ID
 *                 name:
 *                   type: string
 *                   description: 상품 이름
 *                 description:
 *                   type: string
 *                   description: 상품 설명
 *                 price:
 *                   type: number
 *                   description: 상품 가격
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 상품 생성 시각
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 상품 수정 시각
 *       404:
 *         description: 상품을 찾을 수 없음
 *       403:
 *         description: 수정 권한 없음
 */
router.patch("/:id", authHandler_1.validateUser, validate_1.upload.array("images", 3), (0, validate_1.checkUUIDParams)("id"), (0, asyncHandler_1.default)(products_controller_1.updateProduct));
/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       204:
 *         description: 상품 삭제 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *       403:
 *         description: 삭제 권한 없음
 */
router.delete("/:id", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("id"), (0, asyncHandler_1.default)(products_controller_1.deleteProduct));
/**
 * @swagger
 * /products/{productId}/favorites:
 *   post:
 *     summary: 상품 좋아요 추가
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       201:
 *         description: 좋아요 추가 성공
 *       400:
 *         description: 이미 좋아요한 경우
 */
router.put("/:productId/favorite", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("productId"), (0, asyncHandler_1.default)(favorites_controller_1.addFavorite));
/**
 * @swagger
 * /products/{productId}/favorites:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *       404:
 *         description: 좋아요가 없는 경우
 */
router.delete("/:productId/favorite", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("productId"), (0, asyncHandler_1.default)(favorites_controller_1.removeFavorite));
/**
 * @swagger
 * /products/{productId}/comments:
 *   post:
 *     summary: 상품에 댓글 작성
 *     tags: [Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
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
 *     responses:
 *       201:
 *         description: 댓글 작성 성공
 *       400:
 *         description: 댓글 내용이 비어 있음
 */
router.post("/:productId/comments", authHandler_1.validateUser, (0, validate_1.checkUUIDParams)("productId"), (0, asyncHandler_1.default)(comments_controller_1.addComment));
/**
 * @swagger
 * /products/{productId}/comments:
 *   get:
 *     summary: 상품의 모든 댓글 조회
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
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
router.get("/:productId/comments", (0, validate_1.checkUUIDParams)("productId"), (0, asyncHandler_1.default)(comments_controller_1.getComments));
exports.default = router;
