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
exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticle = exports.getArticles = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const client_1 = require("@prisma/client");
const getArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, take = 10, sortBy = "createdAt" } = req.query;
        const rawSearch = req.query.search;
        const searchValue = typeof rawSearch === "string" ? rawSearch : "";
        const currentPage = Number(page);
        const limit = Number(take);
        let orderByCondition = { createdAt: "desc" };
        if (sortBy === "favorites") {
            orderByCondition = [
                { favorites: { _count: "desc" } },
                { createdAt: "desc" },
            ];
        }
        const whereCondition = searchValue.length > 0
            ? {
                OR: [
                    {
                        title: {
                            contains: searchValue,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        content: {
                            contains: searchValue,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                ],
            }
            : undefined;
        const articles = yield prismaClient_1.default.article.findMany({
            skip: (currentPage - 1) * limit,
            take: limit,
            orderBy: orderByCondition,
            where: whereCondition,
            include: {
                _count: {
                    select: { favorites: true },
                },
                favorites: req.user
                    ? { where: { userId: req.user.id }, select: { id: true } }
                    : undefined,
                user: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        const result = articles.map((article) => {
            var _a;
            const isLiked = Array.isArray(article.favorites) && article.favorites.length > 0;
            const favoriteCount = ((_a = article._count) === null || _a === void 0 ? void 0 : _a.favorites) || 0;
            const { favorites, _count } = article, rest = __rest(article, ["favorites", "_count"]);
            return Object.assign(Object.assign({}, rest), { isLiked,
                favoriteCount });
        });
        const totalCount = yield prismaClient_1.default.article.count({
            where: whereCondition,
        });
        res.status(200).json({
            success: true,
            articles: result,
            totalCount,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getArticles = getArticles;
const getArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const article = yield prismaClient_1.default.article.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                imageUrls: true,
                _count: { select: { favorites: true } },
                favorites: userId
                    ? { where: { userId }, select: { id: true } }
                    : undefined,
                comments: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: { select: { id: true, nickname: true } },
                    },
                },
            },
        });
        if (!article)
            return next({ status: 404, message: "게시글을 찾을 수 없습니다." });
        const isLiked = Array.isArray(article.favorites) && article.favorites.length > 0;
        const favoriteCount = article._count.favorites;
        const { favorites, _count } = article, rest = __rest(article, ["favorites", "_count"]);
        res.status(200).json(Object.assign(Object.assign({}, rest), { isLiked, favoriteCount }));
    }
    catch (err) {
        next(err);
    }
});
exports.getArticle = getArticle;
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return next({ status: 401, message: "로그인이 필요합니다." });
        const { title, content } = req.body;
        if (!title || !content) {
            return next({ status: 400, message: "제목과 내용을 모두 입력해주세요." });
        }
        const uploadedImages = Array.isArray(req.files)
            ? req.files.map((file) => `/uploads/${encodeURIComponent(file.filename)}`)
            : [];
        const existingImageUrls = req.body.imageUrls
            ? Array.isArray(req.body.imageUrls)
                ? req.body.imageUrls
                : [req.body.imageUrls]
            : [];
        const imageUrls = [...existingImageUrls, ...uploadedImages];
        const article = yield prismaClient_1.default.article.create({
            data: {
                title,
                content,
                imageUrls,
                userId: req.user.id,
            },
        });
        res.status(201).json({
            success: true,
            data: article,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createArticle = createArticle;
const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!title || !content) {
            return next({ status: 400, message: "제목과 내용을 모두 입력해주세요." });
        }
        const uploadedImages = Array.isArray(req.files)
            ? req.files.map((file) => `/uploads/${encodeURIComponent(file.filename)}`)
            : [];
        const existingImageUrls = req.body.imageUrls
            ? Array.isArray(req.body.imageUrls)
                ? req.body.imageUrls
                : [req.body.imageUrls]
            : [];
        const article = yield prismaClient_1.default.article.findUnique({ where: { id } });
        if (!article)
            return next({ status: 404, message: "게시글을 찾을 수 없습니다." });
        if (article.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return next({ status: 403, message: "권한이 없습니다." });
        const imageUrls = [...existingImageUrls, ...uploadedImages];
        const updated = yield prismaClient_1.default.article.update({
            where: { id },
            data: {
                title,
                content,
                imageUrls,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const article = yield prismaClient_1.default.article.findUnique({ where: { id } });
        if (!article)
            return next({ status: 404, message: "게시글을 찾을 수 없습니다." });
        if (article.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
            return next({ status: 403, message: "권한이 없습니다." });
        yield prismaClient_1.default.article.delete({ where: { id } });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.deleteArticle = deleteArticle;
