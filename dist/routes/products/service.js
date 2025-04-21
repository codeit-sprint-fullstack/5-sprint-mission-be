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
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("../../prismaClient"));
// 전체 상품 목록 조회
const getProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const orderBy = req.query.orderBy || "recent";
        const sortOption = orderBy === "favorite"
            ? [
                { favoritesCount: client_1.Prisma.SortOrder.desc },
                { createdAt: client_1.Prisma.SortOrder.desc },
            ]
            : {
                createdAt: orderBy === "recent"
                    ? client_1.Prisma.SortOrder.desc
                    : client_1.Prisma.SortOrder.asc,
            };
        const keyword = req.query.keyword || "";
        const searchCriteria = {
            AND: [
                {
                    OR: [
                        {
                            name: { contains: keyword, mode: client_1.Prisma.QueryMode.insensitive },
                        },
                        {
                            description: {
                                contains: keyword,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                        {
                            ProductTag: {
                                some: {
                                    tag: {
                                        contains: keyword,
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                    },
                                },
                            },
                        },
                    ],
                },
                { deletedAt: null },
            ],
        };
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let likedProductIds = [];
        if (userId) {
            const userLikes = yield prismaClient_1.default.likeProduct.findMany({
                where: {
                    userId: userId,
                    deletedAt: null,
                },
                select: {
                    productId: true,
                },
            });
            likedProductIds = userLikes.map((item) => item.productId);
        }
        const products = yield prismaClient_1.default.product.findMany({
            where: searchCriteria,
            orderBy: sortOption,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                images: true,
                favoritesCount: true,
                createdAt: true,
                updatedAt: true,
                ProductTag: {
                    select: {
                        tag: true,
                    },
                },
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
            skip,
            take: pageSize,
        });
        const formattedProducts = products.map((product) => {
            const isLiked = userId ? likedProductIds.includes(product.id) : false;
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                images: product.images,
                tags: product.ProductTag.map((pt) => pt.tag),
                likeCount: product.favoritesCount,
                isLiked: isLiked,
                ownerId: product.User.id,
                ownerNickname: product.User.nickname,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
            };
        });
        const totalProducts = yield prismaClient_1.default.product.count({
            where: searchCriteria,
        });
        const totalPages = Math.ceil(totalProducts / pageSize);
        res.status(200).send({
            ProductList: formattedProducts,
            totalProducts,
            totalPages,
        });
    }
    catch (error) {
        next(error);
    }
});
// 상품 상세 조회
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const product = yield prismaClient_1.default.product.findUnique({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                ProductTag: true,
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        if (!product) {
            const error = new Error("상품을 찾을 수 없습니다.");
            error.name = "NotFoundError";
            throw error;
        }
        let isLiked = false;
        if (userId) {
            const likeExists = yield prismaClient_1.default.likeProduct.findFirst({
                where: {
                    userId: userId,
                    productId: id,
                    deletedAt: null,
                },
            });
            isLiked = !!likeExists;
        }
        const productWithLike = Object.assign(Object.assign({}, product), { likeCount: product.favoritesCount, isLiked: isLiked, ownerId: product.User.id, ownerNickname: product.User.nickname, User: undefined });
        res.status(200).send(productWithLike);
    }
    catch (error) {
        next(error);
    }
});
// 상품 등록
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const { name, description, price, images = [], tags = [] } = req.body;
        const { id: userId } = req.user;
        const imageArray = Array.isArray(images)
            ? images
            : [images].filter(Boolean);
        const newProduct = yield prismaClient_1.default.product.create({
            data: {
                userId,
                name,
                description,
                price: Number(price),
                images: imageArray,
                ProductTag: {
                    connectOrCreate: tags.map((tag) => ({
                        where: { tag },
                        create: { tag },
                    })),
                },
            },
            include: {
                ProductTag: true,
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        const responseProduct = Object.assign(Object.assign({}, newProduct), { ownerId: newProduct.User.id, ownerNickname: newProduct.User.nickname, User: undefined });
        res.status(201).send(responseProduct);
    }
    catch (error) {
        next(error);
    }
});
// id로 선택한 상품 수정
const patchProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const id = req.params.id;
        const { name, description, price, images = [], tags = [] } = req.body;
        const { id: userId } = req.user;
        const existingProduct = yield prismaClient_1.default.product.findUnique({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                ProductTag: true,
            },
        });
        if (!existingProduct) {
            const error = new Error("상품을 찾을 수 없습니다.");
            error.name = "NotFoundError";
            throw error;
        }
        // 상품 소유자 확인
        if (existingProduct.userId !== userId) {
            const error = new Error("상품을 수정할 권한이 없습니다.");
            error.name = "ForbiddenError";
            throw error;
        }
        const updateData = {
            name,
            description,
            price: Number(price),
            images: images || [],
        };
        if (tags) {
            updateData.ProductTag = {
                //기존에 있던 태그는 테이블 연결 해제하고 새로운 태그 연결해주기
                disconnect: existingProduct.ProductTag.map((tag) => ({ id: tag.id })),
                connectOrCreate: tags.length > 0
                    ? tags.map((tag) => ({
                        where: { tag },
                        create: { tag },
                    }))
                    : [],
            };
        }
        const updatedProduct = yield prismaClient_1.default.product.update({
            where: { id },
            data: updateData,
            include: {
                ProductTag: true,
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        const responseProduct = Object.assign(Object.assign({}, updatedProduct), { ownerId: updatedProduct.User.id, ownerNickname: updatedProduct.User.nickname, User: undefined });
        res.status(200).send(responseProduct);
    }
    catch (error) {
        next(error);
    }
});
// 상품 삭제
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const id = req.params.id;
        const { id: userId } = req.user;
        const existingProduct = yield prismaClient_1.default.product.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingProduct) {
            const error = new Error("상품을 찾을 수 없습니다.");
            error.name = "NotFoundError";
            throw error;
        }
        if (existingProduct.userId !== userId) {
            const error = new Error("상품을 삭제할 권한이 없습니다.");
            error.name = "ForbiddenError";
            throw error;
        }
        const deletedProduct = yield prismaClient_1.default.product.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
            select: {
                id: true,
                name: true,
                deletedAt: true,
            },
        });
        if (!deletedProduct) {
            const error = new Error("상품을 삭제할 수 없습니다.");
            error.name = "NotFoundError";
            throw error;
        }
        res.status(202).send({
            isSuccess: true,
            message: "삭제 처리가 완료되었습니다.",
        });
    }
    catch (error) {
        next(error);
    }
});
// 상품 좋아요
const createLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const { id } = req.params;
        const { id: userId } = req.user;
        const result = yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield tx.product.findUnique({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!product) {
                const error = new Error("상품을 찾을 수 없습니다.");
                error.name = "NotFoundError";
                throw error;
            }
            const existingLike = yield tx.likeProduct.findFirst({
                where: {
                    userId,
                    productId: id,
                    deletedAt: null,
                },
            });
            if (existingLike) {
                const error = new Error("이미 좋아요한 상품입니다.");
                error.name = "ValidationError";
                throw error;
            }
            const like = yield tx.likeProduct.create({
                data: {
                    userId,
                    productId: id,
                },
            });
            const updatedProduct = yield tx.product.update({
                where: { id },
                data: {
                    favoritesCount: { increment: 1 },
                },
                include: {
                    ProductTag: true,
                    User: {
                        select: {
                            id: true,
                            nickname: true,
                        },
                    },
                },
            });
            return {
                like,
                product: Object.assign(Object.assign({}, updatedProduct), { isLiked: true, ownerId: updatedProduct.User.id, ownerNickname: updatedProduct.User.nickname, User: undefined }),
            };
        }));
        res.status(201).send({
            isSuccess: true,
            data: result.product,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const { id } = req.params;
        const { id: userId } = req.user;
        const result = yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield tx.product.findUnique({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!product) {
                const error = new Error("상품을 찾을 수 없습니다.");
                error.name = "NotFoundError";
                throw error;
            }
            const existingLike = yield tx.likeProduct.findFirst({
                where: {
                    userId,
                    productId: id,
                    deletedAt: null,
                },
            });
            if (!existingLike) {
                const error = new Error("좋아요 정보를 찾을 수 없습니다.");
                error.name = "NotFoundError";
                throw error;
            }
            const deletedLike = yield tx.likeProduct.update({
                where: { id: existingLike.id },
                data: {
                    deletedAt: new Date(),
                },
            });
            const updatedProduct = yield tx.product.update({
                where: { id },
                data: {
                    favoritesCount: { decrement: 1 },
                },
                include: {
                    ProductTag: true,
                    User: {
                        select: {
                            id: true,
                            nickname: true,
                        },
                    },
                },
            });
            return {
                deletedLike,
                product: Object.assign(Object.assign({}, updatedProduct), { isLiked: false, ownerId: updatedProduct.User.id, ownerNickname: updatedProduct.User.nickname, User: undefined }),
            };
        }));
        res.status(200).send({
            message: "좋아요가 취소되었습니다.",
            data: result.product,
        });
    }
    catch (error) {
        next(error);
    }
});
const service = {
    getProductList,
    getProduct,
    createProduct,
    patchProduct,
    deleteProduct,
    createLike,
    deleteLike,
};
exports.default = service;
//# sourceMappingURL=service.js.map