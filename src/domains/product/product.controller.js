"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.addFavorite = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const productService = __importStar(require("./product.service"));
const userService = __importStar(require("../user/user.service"));
const utils_1 = require("../../utils");
const product_service_1 = require("./product.service");
/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품명
 *                 default: ""
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *                 default: ""
 *               price:
 *                 type: number
 *                 description: 상품 가격
 *                 default: 0
 *               tags:
 *                 type: string
 *                 description: "쉼표로 구분된 태그 목록 (예: \"태그1,태그2,태그3\")"
 *                 default: ""
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 상품 이미지 파일 (다중 업로드 가능)
 *     responses:
 *       201:
 *         description: 상품 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 등록 성공
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품명, 설명, 가격은 필수로 입력해야합니다.
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 등록 중 오류가 발생했습니다.
 */
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 업로드된 파일 경로 추적
    const uploadedFiles = [];
    try {
        //  console.log("👤 인증 정보 ", req.user);
        // JWT에서 사용자 ID 추출
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // userId 없으면 에러 응답
        if (!userId) {
            console.error("❌ 사용자 ID not found");
            res.status(401).json({ message: "인증 정보가 올바르지 않습니다." });
            (0, utils_1.deleteFiles)(uploadedFiles);
            return;
        }
        //console.log(`🔍 JWT에서 추출한 사용자 ID: ${userId}`);
        // userId로 user 테이블 조회
        const user = yield userService.getUserById(userId);
        // 사용자 정보 없으면 에러 응답
        if (!user) {
            console.error("❌ 사용자 정보 not found", { userId });
            (0, utils_1.deleteFiles)(uploadedFiles);
            return;
        }
        //console.log(`✅ 사용자 정보 : ${user.id}, ${user.nickname}`);
        // 요청 데이터 추출
        const { name, description, price, tags } = req.body;
        const files = req.files;
        console.log("파일 업로드:", req.files);
        console.log(" 요청 바디:", req.body);
        // 필수 필드 검증
        if (!name || description === undefined || price === undefined) {
            res.status(400).json({
                message: "상품명, 설명, 가격은 필수로 입력해야합니다.",
            });
            (0, utils_1.deleteFiles)(uploadedFiles);
            return;
        }
        // 가격 유효성 검사
        if (!(0, product_service_1.validateProductPrice)(Number(price))) {
            res
                .status(400)
                .json({ message: "상품 가격은 0원부터 1억원 사이로 입력해주세요." });
            (0, utils_1.deleteFiles)(uploadedFiles);
            return;
        }
        // 파일 처리
        let imageUrls = [];
        if (files && files.length > 0) {
            imageUrls = files.map((file) => `/uploads/${file.filename}`);
            uploadedFiles.push(...files.map((file) => path_1.default.join(process.cwd(), "public", "uploads", file.filename)));
        }
        else if (req.body.images) {
            try {
                const parsedImages = typeof req.body.images === "string"
                    ? JSON.parse(req.body.images)
                    : req.body.images;
                imageUrls = Array.isArray(parsedImages) ? parsedImages : [parsedImages];
            }
            catch (e) {
                console.warn("이미지 파싱 실패:", e);
                if (typeof req.body.images === "string" &&
                    req.body.images.startsWith("http")) {
                    imageUrls = [req.body.images];
                }
            }
        }
        // 태그 처리
        const productTags = (0, utils_1.parseTags)(tags);
        // 상품 생성 (사용자 정보는 조회한 실제 데이터 사용)
        const newProduct = yield productService.createProduct({
            ownerId: user.id,
            ownerNickname: user.nickname,
            name,
            description,
            price: Number(price),
            tags: productTags || [],
            images: imageUrls,
        });
        console.log(`✅ 상품 등록 성공: ${newProduct.id}`);
        res.status(200).json({
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            images: newProduct.images,
            tags: newProduct.tags,
            ownerId: newProduct.ownerId,
            ownerNickname: newProduct.ownerNickname,
            favoriteCount: newProduct.likeCount,
            createdAt: newProduct.createdAt,
        });
    }
    catch (err) {
        console.error(" 상품 등록 실패:", err);
        // 실패 시 업로드된 파일 삭제
        (0, utils_1.deleteFiles)(uploadedFiles);
        next(err);
    }
});
exports.createProduct = createProduct;
/**
 * @swagger
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [recent, favorite]
 *           default: recent
 *         description: 정렬 방식 (최신순, 인기순)
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalCount:
 *                   type: integer
 *                   description: 전체 상품 수
 *                 totalPages:
 *                   type: integer
 *                   description: 전체 페이지 수
 *                 currentPage:
 *                   type: integer
 *                   description: 현재 페이지 번호
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 목록 조회 실패
 *                 error:
 *                   type: object
 */
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const keyword = req.query.keyword || req.query.keywords || "";
        const orderBy = req.query.orderBy || "recent";
        console.log("📥 [GET /products] 요청 쿼리:", {
            page,
            pageSize,
            keyword,
            orderBy,
        });
        const list = yield productService.getProducts({
            page,
            pageSize,
            keyword,
            orderBy,
        });
        if (keyword && list.totalCount === 0) {
            console.log(`⚠️ [GET /products] '${keyword}' 검색 결과 없음`);
        }
        else {
            console.log("✅ [GET /products] 상품 목록 조회 성공");
            console.log("📦 조회된 상품 수:", list.list.length);
            console.log("🧮 전체 상품 수:", list.totalCount);
        }
        const totalPages = Math.ceil(list.totalCount / pageSize);
        res.status(200).json(Object.assign(Object.assign({}, list), { currentPage: page, totalPages, keyword: keyword || undefined }));
    }
    catch (err) {
        // 에러 핸들러 미들웨어로 에러 전달
        next(err);
    }
});
exports.getProducts = getProducts;
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 조회 실패
 *                 error:
 *                   type: object
 */
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // ownerId 없이 테스트용으로 빈 문자열 전달
        const product = yield productService.getProductById(id, "");
        if (!product) {
            res.status(404).json({ message: "상품을 찾을 수 없습니다." });
            return;
        }
        res.status(200).json(product);
    }
    catch (err) {
        console.error("❌ [GET /products/:id] 상품 상세 조회 실패:", err);
        next(err);
    }
});
exports.getProductById = getProductById;
/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: 상품 정보 수정
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품명
 *                 default: ""
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *                 default: ""
 *               price:
 *                 type: number
 *                 description: 상품 가격 (0 ~ 100,000,000원)
 *                 minimum: 0
 *                 maximum: 100000000
 *                 default: ""
 *               tags:
 *                 type: string
 *                 description: "쉼표로 구분된 태그 목록 (예: \"태그1,태그2,태그3\")"
 *                 default: ""
 *               existingImages:
 *                 type: string
 *                 description: 유지할 기존 이미지 경로들의 JSON 문자열
 *                 example: "[\"url1\", \"url2\"]"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 새로 추가할 상품 이미지 파일 (다중 업로드 가능)
 *               deleteAllImages:
 *                 type: boolean
 *                 description: 모든 이미지 삭제 여부 (true인 경우 모든 이미지 삭제)
 *                 example: false
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 수정 성공
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 정보가 올바르지 않습니다.
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다. 로그인 후 다시 시도해주세요.
 *       403:
 *         description: 접근 권한 없음 또는 가격 범위 초과
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 자신이 등록한 상품만 수정할 수 있습니다.
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: 상품 가격은 0원부터 1억원 사이로 입력해주세요.
 *                     field:
 *                       type: string
 *                       example: price
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 수정 중 오류가 발생했습니다.
 */
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 업로드된 새 파일들의 경로
    const uploadedFiles = [];
    // 삭제해야 할 기존 파일들 경로
    const filesToDelete = [];
    try {
        //console.log("👤 인증 정보 ", req.user);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // userId 없으면 에러 응답
        if (!userId) {
            console.error("❌ 사용자 ID not found");
            res
                .status(401)
                .json({ message: "인증이 필요합니다. 로그인 후 다시 시도해주세요." });
            (0, utils_1.deleteFiles)(uploadedFiles);
            return;
        }
        //console.log(`🔍 JWT에서 추출한 사용자 ID: ${userId}`);
        const { id } = req.params;
        const { name, description, price, tags, existingImages, deleteAllImages, ownerNickname, } = req.body;
        const files = req.files;
        console.log("🔄 [PATCH /products/:id] 상품 수정 요청:", {
            id,
            userId,
            name,
            description,
            price,
        });
        // 기존 상품 정보 조회
        const existingProduct = yield productService.getProductById(id, userId);
        if (!existingProduct) {
            res.status(404).json({ message: "상품을 찾을 수 없습니다." });
            (0, utils_1.deleteFiles)(uploadedFiles);
            return;
        }
        // 상품 소유자 확인은 서비스 계층에서 처리 (여기선 미리 확인으로 좋은 UX 제공)
        if (existingProduct.ownerId !== userId) {
            res.status(403).json({
                message: "자신이 등록한 상품만 수정할 수 있습니다.",
            });
            (0, utils_1.deleteFiles)(uploadedFiles);
            return;
        }
        //이미지 처리
        let finalImages = [];
        // 모든 이미지 삭제 옵션이 활성화된 경우
        if (deleteAllImages === "true" || deleteAllImages === true) {
            console.log("🗑️ 이미지 삭제 요청");
            // 기존 이미지 삭제를 위해 경로 저장
            if (existingProduct.images && existingProduct.images.length > 0) {
                existingProduct.images.forEach((imgPath) => {
                    const fullPath = (0, utils_1.getFullImagePath)(imgPath);
                    if (fs_1.default.existsSync(fullPath)) {
                        filesToDelete.push(fullPath);
                    }
                });
            }
            // 빈 배열로 모든 이미지 삭제
            finalImages = [];
        }
        // 특정 이미지만 유지
        else if (existingImages) {
            try {
                // 유지할 이미지 경로 파싱
                const imagesToKeep = typeof existingImages === "string"
                    ? JSON.parse(existingImages)
                    : existingImages;
                const imagesToKeepArray = Array.isArray(imagesToKeep)
                    ? imagesToKeep
                    : [imagesToKeep];
                // 삭제할 이미지 찾기 (기존 이미지 중 유지 목록에 없는 것)
                if (existingProduct.images && existingProduct.images.length > 0) {
                    existingProduct.images.forEach((imgPath) => {
                        if (!imagesToKeepArray.includes(imgPath)) {
                            const fullPath = (0, utils_1.getFullImagePath)(imgPath);
                            if (fs_1.default.existsSync(fullPath)) {
                                filesToDelete.push(fullPath);
                            }
                        }
                    });
                }
                finalImages = imagesToKeepArray;
            }
            catch (e) {
                // 파싱 실패 시 기존 이미지 모두 유지
                finalImages = existingProduct.images || [];
            }
        }
        // 기존 이미지 정보가 없는 경우 모두 유지
        else {
            finalImages = existingProduct.images || [];
        }
        // 새 이미지 추가
        if (files && files.length > 0) {
            const newImageUrls = files.map((file) => `/uploads/${file.filename}`);
            // 파일 경로 추적
            uploadedFiles.push(...files.map((file) => path_1.default.join(process.cwd(), "public", "uploads", file.filename)));
            // 기존 이미지에 새 이미지 추가
            finalImages = [...finalImages, ...newImageUrls];
        }
        // 태그 파싱
        const productTags = (0, utils_1.parseTags)(tags);
        // 업데이트할 데이터
        const updateData = {
            name,
            description,
            ownerNickname,
            price: price !== undefined ? Number(price) : undefined,
            tags: productTags,
            images: finalImages,
        };
        // undefined 값 제거
        const cleanedData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));
        console.log("📝 업데이트 데이터:", cleanedData);
        try {
            // 수정된 서비스 함수 호출 방식으로 변경 (userId를 별도 매개변수로 전달)
            const updatedProduct = yield productService.updateProduct(id, userId, cleanedData);
            // 업데이트 성공 시 필요 없는 기존 이미지 파일 삭제
            (0, utils_1.deleteFiles)(filesToDelete);
            res.status(200).json({
                message: "상품 수정 성공",
                data: updatedProduct,
            });
        }
        catch (error) {
            // 서비스 계층에서 발생한 오류 처리
            if (error instanceof Error) {
                // 가격 검증 오류
                if (error.message.includes("상품 가격")) {
                    res.status(400).json({
                        message: error.message,
                        field: "price",
                    });
                    (0, utils_1.deleteFiles)(uploadedFiles);
                    return;
                }
                // 권한 없음 또는 상품 존재하지 않음
                else if (error.message.includes("수정 권한이 없거나")) {
                    res.status(403).json({
                        message: "자신이 등록한 상품만 수정할 수 있습니다.",
                    });
                    (0, utils_1.deleteFiles)(uploadedFiles);
                    return;
                }
            }
            // 그 외 오류는 다시 던지기
            throw error;
        }
    }
    catch (err) {
        console.error("❌ 상품 수정 실패:", err);
        // 실패 시 업로드된 새 파일 삭제
        (0, utils_1.deleteFiles)(uploadedFiles);
        next(err);
    }
});
exports.updateProduct = updateProduct;
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 삭제 성공
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다. 로그인 후 다시 시도해주세요.
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 삭제 권한이 없습니다. 자신이 등록한 상품만 삭제할 수 있습니다.
 *       404:
 *         description: 상품을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품을 찾을 수 없습니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 상품 삭제 실패
 *                 error:
 *                   type: object
 */
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    try {
        console.log("👤 인증 정보 ", req.user);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // userId 없으면 에러 응답
        if (!userId) {
            console.error("❌ 사용자 ID not found");
            res.status(401).json({
                message: "인증이 필요합니다. 로그인 후 다시 시도해주세요.",
            });
            return;
        }
        console.log(`🔍 JWT에서 추출한 사용자 ID: ${userId}`);
        console.log(`🗑️ [DELETE /products/:id] 상품 삭제 요청: ${id}, 사용자: ${userId}`);
        // 삭제할 상품 정보 먼저 조회 (이미지 파일 경로 확보를 위해)
        const productToDelete = yield productService.getProductById(id, "");
        if (!productToDelete) {
            res.status(404).json({ message: "상품을 찾을 수 없습니다." });
            return;
        }
        // 삭제할 이미지 파일 경로 수집
        const filesToDelete = [];
        if (productToDelete.images && productToDelete.images.length > 0) {
            productToDelete.images.forEach((imagePath) => {
                // 상대 경로를 절대 경로로 변환 (경로 시작의 '/' 처리)
                const fullPath = path_1.default.join(process.cwd(), "public", imagePath.replace(/^\//, ""));
                if (fs_1.default.existsSync(fullPath)) {
                    filesToDelete.push(fullPath);
                }
                else {
                    console.log(`⚠️ 파일이 존재하지 않음: ${fullPath}`);
                }
            });
        }
        // 서비스 함수 호출 - 권한 검사는 서비스 계층에서 수행
        const result = yield productService.deleteProduct(id, userId);
        // 서비스 계층에서 권한 또는 존재 여부 검증 실패
        if (!result.success) {
            if (((_b = result.message) !== null && _b !== void 0 ? _b : "").includes("삭제 권한이 없습니다")) {
                res.status(403).json({ message: result.message });
            }
            else {
                res.status(404).json({ message: result.message });
            }
            return;
        }
        // 삭제 성공 시 연결된 이미지 파일 제거
        if (filesToDelete.length > 0) {
            console.log(`🗑️ 상품 ID ${id}와 연결된 ${filesToDelete.length}개 이미지 파일 삭제 시작`);
            filesToDelete.forEach((filePath) => {
                try {
                    fs_1.default.unlinkSync(filePath);
                    console.log(`✅ 파일 삭제 성공: ${filePath}`);
                }
                catch (e) {
                    console.error(`❌ 파일 삭제 실패: ${filePath}`, e);
                }
            });
        }
        res.status(200).json({
            message: "상품 삭제 성공",
            deletedImages: filesToDelete.length,
        });
    }
    catch (err) {
        console.error("❌ [DELETE /products/:id] 상품 삭제 실패:", err);
        next(err);
    }
});
exports.deleteProduct = deleteProduct;
/**
 * @swagger
 * /products/{id}/favorite:
 *   post:
 *     summary: 상품에 좋아요 추가
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 좋아요 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 좋아요가 추가되었습니다
 *                 likeCount:
 *                   type: number
 *                   example: 5
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
const addFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: productId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "인증이 필요합니다." });
            return;
        }
        console.log("👍 좋아요 추가 요청:", { productId, userId });
        try {
            const result = yield productService.addFavorite(productId, userId);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === "상품을 찾을 수 없습니다") {
                    res.status(404).json({ message: error.message });
                    return;
                }
            }
            throw error;
        }
    }
    catch (err) {
        console.error("❌ 좋아요 추가 실패:", err);
        next(err);
    }
});
exports.addFavorite = addFavorite;
/**
 * @swagger
 * /products/{id}/favorite:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 좋아요가 취소되었습니다
 *                 likeCount:
 *                   type: number
 *                   example: 4
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음 또는 좋아요 정보를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
const removeFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: productId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "인증이 필요합니다." });
            return;
        }
        console.log("👎 좋아요 취소 요청:", { productId, userId });
        try {
            const result = yield productService.removeFavorite(productId, userId);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === "상품을 찾을 수 없습니다") {
                    res.status(404).json({ message: error.message });
                    return;
                }
            }
            throw error;
        }
    }
    catch (err) {
        console.error("❌ 좋아요 취소 실패:", err);
        next(err);
    }
});
exports.removeFavorite = removeFavorite;
