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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const client_1 = require("@prisma/client");
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawPage = req.query.page;
        const rawLimit = req.query.limit;
        const sortBy = req.query.sortBy || "createdAt";
        const page = rawPage !== undefined && rawPage !== "undefined" ? Number(rawPage) : 1;
        const limit = rawLimit !== undefined && rawLimit !== "undefined"
            ? Number(rawLimit)
            : 10;
        const parsedPage = isNaN(page) || page < 1 ? 1 : page;
        const parsedLimit = isNaN(limit) || limit < 1 ? 10 : limit;
        const skip = (parsedPage - 1) * parsedLimit;
        const rawSearch = req.query.search;
        const searchValue = typeof rawSearch === "string" ? rawSearch.trim() : "";
        const whereCondition = searchValue.length > 0
            ? {
                OR: [
                    {
                        name: {
                            contains: searchValue,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        description: {
                            contains: searchValue,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                ],
            }
            : {};
        let orderByCondition = { createdAt: "desc" };
        if (sortBy === "favorites") {
            orderByCondition = [
                { favorites: { _count: "desc" } },
                { createdAt: "desc" },
            ];
        }
        const [products, totalCount] = yield Promise.all([
            prismaClient_1.default.product.findMany({
                skip,
                take: parsedLimit,
                orderBy: orderByCondition,
                where: whereCondition,
                include: {
                    _count: {
                        select: {
                            favorites: true,
                            comments: true,
                        },
                    },
                    favorites: req.user
                        ? { where: { userId: req.user.id }, select: { id: true } }
                        : undefined,
                },
            }),
            prismaClient_1.default.product.count({ where: whereCondition }),
        ]);
        const result = products.map((product) => {
            var _a;
            const isLiked = Array.isArray(product.favorites) && product.favorites.length > 0;
            const favoriteCount = ((_a = product._count) === null || _a === void 0 ? void 0 : _a.favorites) || 0;
            const { favorites, _count } = product, rest = __rest(product, ["favorites", "_count"]);
            return Object.assign(Object.assign({}, rest), { isLiked,
                favoriteCount });
        });
        res.status(200).json({ products: result, totalCount });
        return;
    }
    catch (err) {
        console.error("[BACKEND] getProducts error:", err);
        next(err);
    }
});
exports.getProducts = getProducts;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const product = yield prismaClient_1.default.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                imageUrls: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
                comments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                nickname: true,
                            },
                        },
                    },
                },
                favorites: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        favorites: true,
                    },
                },
            },
        });
        if (!product)
            return next({ status: 404, message: "상품을 찾을 수 없습니다." });
        const isLiked = userId
            ? product.favorites.some((fav) => fav.userId === userId)
            : false;
        const favoriteCount = (_c = (_b = product._count) === null || _b === void 0 ? void 0 : _b.favorites) !== null && _c !== void 0 ? _c : 0;
        res.status(200).json({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            tags: product.tags,
            imageUrls: product.imageUrls,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            user: product.user,
            comments: product.comments,
            isLiked,
            favoriteCount,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getProduct = getProduct;
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return next({ status: 401, message: "로그인이 필요합니다." });
        const { name, description, price, tags } = req.body;
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return next({ status: 400, message: "가격 형식이 올바르지 않습니다." });
        }
        let parsedTags = [];
        if (typeof tags === "string" && tags.length > 0) {
            try {
                parsedTags = JSON.parse(tags);
                if (!Array.isArray(parsedTags))
                    throw new Error();
            }
            catch (_a) {
                console.error("[❌ 태그 파싱 실패]:", tags);
                return next({ status: 400, message: "태그 형식이 올바르지 않습니다." });
            }
        }
        const imageUrls = Array.isArray(req.files)
            ? req.files.map((file) => `/uploads/${encodeURIComponent(file.filename)}`)
            : [];
        const product = yield prismaClient_1.default.product.create({
            data: {
                name,
                description,
                price: parsedPrice,
                tags: { set: parsedTags },
                imageUrls: { set: imageUrls },
                userId: req.user.id,
            },
        });
        res.status(201).json(product);
    }
    catch (err) {
        next(err);
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { name, description, price, tags, imageUrls } = req.body;
        const product = yield prismaClient_1.default.product.findUnique({ where: { id } });
        if (!product)
            return next({ status: 404, message: "상품을 찾을 수 없습니다." });
        if (product.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return next({ status: 403, message: "권한이 없습니다." });
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return next({ status: 400, message: "가격 형식이 올바르지 않습니다." });
        }
        let parsedTags = [];
        if (typeof tags === "string" && tags.length > 0) {
            try {
                parsedTags = JSON.parse(tags);
                if (!Array.isArray(parsedTags))
                    throw new Error();
            }
            catch (_b) {
                return next({ status: 400, message: "태그 형식이 올바르지 않습니다." });
            }
        }
        let updatedData = {
            name,
            description,
            price: parsedPrice,
            tags: { set: parsedTags },
        };
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            updatedData.imageUrls = {
                set: req.files.map((file) => `/uploads/${encodeURIComponent(file.filename)}`),
            };
        }
        if (imageUrls) {
            updatedData.imageUrls = { set: imageUrls };
        }
        const updatedProduct = yield prismaClient_1.default.product.update({
            where: { id },
            data: updatedData,
        });
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        next(err);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const product = yield prismaClient_1.default.product.findUnique({ where: { id } });
        if (!product)
            return next({ status: 404, message: "상품을 찾을 수 없습니다." });
        if (product.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return next({ status: 403, message: "삭제 권한이 없습니다." });
        yield prismaClient_1.default.product.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.deleteProduct = deleteProduct;
