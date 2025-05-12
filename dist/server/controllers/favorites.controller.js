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
exports.removeFavorite = exports.addFavorite = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const addFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { articleId, productId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next({ status: 401, message: "로그인이 필요합니다." });
        }
        if (!articleId && !productId) {
            return next({
                status: 400,
                message: "articleId 또는 productId가 필요합니다.",
            });
        }
        yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            if (articleId) {
                const exists = yield tx.articleFavorite.findUnique({
                    where: { userId_articleId: { userId, articleId } },
                });
                if (exists) {
                    throw { status: 400, message: "이미 좋아요를 눌렀습니다." };
                }
                yield tx.articleFavorite.create({ data: { userId, articleId } });
            }
            if (productId) {
                const exists = yield tx.productFavorite.findUnique({
                    where: { userId_productId: { userId, productId } },
                });
                if (exists) {
                    throw { status: 400, message: "이미 좋아요를 눌렀습니다." };
                }
                yield tx.productFavorite.create({ data: { userId, productId } });
            }
        }));
        res.status(201).json({ isLike: true, message: "좋아요가 추가되었습니다." });
    }
    catch (err) {
        next(err);
    }
});
exports.addFavorite = addFavorite;
const removeFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { articleId, productId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next({ status: 401, message: "로그인이 필요합니다." });
        }
        if (!articleId && !productId) {
            return next({
                status: 400,
                message: "articleId 또는 productId가 필요합니다.",
            });
        }
        yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            if (articleId) {
                const favorite = yield tx.articleFavorite.findFirst({
                    where: { userId, articleId },
                });
                if (!favorite) {
                    throw { status: 404, message: "이미 좋아요가 취소되었습니다." };
                }
                yield tx.articleFavorite.delete({ where: { id: favorite.id } });
            }
            if (productId) {
                const favorite = yield tx.productFavorite.findFirst({
                    where: { userId, productId },
                });
                if (!favorite) {
                    throw { status: 404, message: "이미 좋아요가 취소되었습니다." };
                }
                yield tx.productFavorite.delete({ where: { id: favorite.id } });
            }
        }));
        res
            .status(200)
            .json({ isLike: false, message: "좋아요가 취소되었습니다." });
    }
    catch (err) {
        next(err);
    }
});
exports.removeFavorite = removeFavorite;
