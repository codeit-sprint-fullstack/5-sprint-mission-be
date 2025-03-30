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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.removeFavorite = exports.addFavorite = exports.getProductById = exports.getProducts = exports.createProduct = exports.validateProductPrice = void 0;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
// 가격 유효성 검사 함수 - 재사용성
const validateProductPrice = (price) => {
    return typeof price === "number" && price >= 0 && price <= 100000000;
};
exports.validateProductPrice = validateProductPrice;
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId, ownerNickname, name, description, price, tags, images } = productData;
    if (!(0, exports.validateProductPrice)(price)) {
        throw new Error("상품 가격은 0원부터 1억원 사이로 입력해주세요.");
    }
    return yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = yield tx.products.create({
            data: {
                id: (0, uuid_1.v4)(),
                ownerId,
                ownerNickname,
                name,
                description,
                price,
                tags,
                images,
                likeCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return newProduct;
    }));
});
exports.createProduct = createProduct;
const getProducts = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, pageSize, keyword, orderBy, }) {
    const skip = (page - 1) * pageSize;
    const where = keyword
        ? {
            name: {
                contains: keyword,
                mode: client_1.Prisma.QueryMode.insensitive,
            },
        }
        : {};
    // orderBy 옵션 recent | favorite
    let orderByOption;
    switch (orderBy) {
        case "favorite": // 좋아요 수 기준 내림차순
            orderByOption = { likeCount: client_1.Prisma.SortOrder.desc };
            break;
        case "recent":
        default:
            orderByOption = { createdAt: client_1.Prisma.SortOrder.desc };
            break;
    }
    const [totalCount, list] = yield Promise.all([
        prismaClient_1.default.products.count({ where }),
        prismaClient_1.default.products.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: orderByOption,
            select: {
                id: true,
                ownerId: true,
                ownerNickname: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                images: true,
                likeCount: true,
                createdAt: true,
            },
        }),
    ]);
    if (keyword) {
        console.log(`🔍 "${keyword}" 검색 결과: ${totalCount}개 `);
    }
    console.log(`📊 정렬 기준: ${orderBy}`);
    return {
        totalCount,
        list,
    };
});
exports.getProducts = getProducts;
const getProductById = (productId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prismaClient_1.default.products.findUnique({
        where: { id: productId },
    });
    if (!product)
        return null;
    const user = yield prismaClient_1.default.users.findUnique({
        where: { id: product.ownerId },
        select: { id: true, nickname: true },
    });
    // 현재 사용자가 좋아요를 눌렀는지
    const isLiked = currentUserId
        ? yield prismaClient_1.default.likes.findFirst({
            where: {
                userId: currentUserId,
                resourceId: productId,
                resourceType: "product",
            },
        })
        : null;
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        tags: product.tags,
        images: product.images,
        createdAt: product.createdAt,
        ownerId: product.ownerId,
        ownerNickname: product.ownerNickname || (user === null || user === void 0 ? void 0 : user.nickname) || "알 수 없음",
        likeCount: product.likeCount, //products 테이블의 값 사용
        isLiked: !!isLiked,
    };
});
exports.getProductById = getProductById;
/**
 * 상품에 좋아요 추가
 * @param productId 상품 ID
 * @param userId 사용자 ID
 * @returns 좋아요 추가 결과 및 업데이트된 좋아요 수
 */
const addFavorite = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!productId) {
        throw new Error("상품 ID가 필요합니다");
    }
    if (!userId) {
        throw new Error("사용자 ID가 필요합니다");
    }
    try {
        return yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield tx.products.findUnique({
                where: { id: productId },
                select: { id: true, likeCount: true, name: true },
            });
            if (!product) {
                throw new Error("상품을 찾을 수 없습니다");
            }
            // 이미 좋아요가 있는지
            const existing = yield tx.likes.findFirst({
                where: {
                    userId,
                    resourceId: productId,
                    resourceType: "product",
                },
            });
            // 이미 좋아요가 있으면 그대로 반환
            if (existing) {
                return {
                    likeCount: product.likeCount,
                    isLiked: true,
                };
            }
            // 좋아요 추가
            yield tx.likes.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    userId,
                    resourceId: productId,
                    resourceType: "product",
                },
            });
            // products 테이블의 likeCount
            const updatedProduct = yield tx.products.update({
                where: { id: productId },
                data: {
                    likeCount: product.likeCount + 1,
                },
                select: { likeCount: true },
            });
            console.log(`👍`);
            return {
                likeCount: updatedProduct.likeCount,
                isLiked: true,
            };
        }));
    }
    catch (error) {
        console.error("좋아요 추가 처리 중 오류:", error);
        if (error instanceof Error) {
            throw error;
        }
        else {
            throw new Error("좋아요 추가 중 알 수 없는 오류가 발생했습니다");
        }
    }
});
exports.addFavorite = addFavorite;
/**
 * 상품 좋아요 취소
 * @param productId 상품 ID
 * @param userId 사용자 ID
 * @returns 좋아요 취소 결과 및 업데이트된 좋아요 수
 */
const removeFavorite = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 파라미터 유효성 검사
    if (!productId) {
        throw new Error("상품 ID가 필요합니다");
    }
    if (!userId) {
        throw new Error("사용자 ID가 필요합니다");
    }
    try {
        return yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 상품 존재 여부 확인
            const product = yield tx.products.findUnique({
                where: { id: productId },
                select: { id: true, likeCount: true, name: true },
            });
            if (!product) {
                throw new Error("상품을 찾을 수 없습니다");
            }
            // 좋아요 정보 확인
            const existing = yield tx.likes.findFirst({
                where: {
                    userId,
                    resourceId: productId,
                    resourceType: "product",
                },
            });
            // 좋아요가 없으면 그대로 반환
            if (!existing) {
                return {
                    likeCount: product.likeCount,
                    isLiked: false,
                };
            }
            // 좋아요 삭제
            yield tx.likes.delete({
                where: { id: existing.id },
            });
            // products 테이블의 likeCount 감소
            const updatedProduct = yield tx.products.update({
                where: { id: productId },
                data: {
                    likeCount: Math.max(0, product.likeCount - 1),
                },
                select: { likeCount: true },
            });
            console.log(`👎 `);
            // 프론트엔드 응답 형식에 맞게 반환
            return {
                likeCount: updatedProduct.likeCount,
                isLiked: false,
            };
        }));
    }
    catch (error) {
        console.error("좋아요 취소 처리 중 오류:", error);
        if (error instanceof Error) {
            throw error;
        }
        else {
            throw new Error("좋아요 취소 중 알 수 없는 오류가 발생했습니다");
        }
    }
});
exports.removeFavorite = removeFavorite;
const updateProduct = (productId, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.price !== undefined && !(0, exports.validateProductPrice)(data.price)) {
        throw new Error("상품 가격은 0원부터 1억원 사이로 입력해주세요.");
    }
    return yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingProduct = yield tx.products.findUnique({
            where: { id: productId },
        });
        if (!existingProduct || existingProduct.ownerId !== userId) {
            throw new Error("수정 권한이 없거나 상품이 존재하지 않습니다.");
        }
        const cleanedData = Object.fromEntries(
        //undefined 값 제거
        Object.entries(data).filter(([_, v]) => v !== undefined));
        const updatedProduct = yield tx.products.update({
            where: { id: productId },
            data: Object.assign(Object.assign({}, cleanedData), { updatedAt: new Date() }),
        });
        return updatedProduct;
    }));
});
exports.updateProduct = updateProduct;
const deleteProduct = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prismaClient_1.default.products.findUnique({
        where: { id: productId },
    });
    if (!existing) {
        return { success: false, message: "상품을 찾을 수 없습니다." };
    }
    if (existing.ownerId !== userId) {
        return {
            success: false,
            message: "삭제 권한이 없습니다. 자신이 등록한 상품만 삭제할 수 있습니다.",
        };
    }
    // 권한 확인 후 삭제 진행
    yield prismaClient_1.default.products.delete({
        where: { id: productId },
    });
    return { success: true };
});
exports.deleteProduct = deleteProduct;
