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
exports.deleteComment = exports.updateComment = exports.addComment = exports.getComments = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId, productId } = req.params;
        const { cursor, take = 10 } = req.query;
        const takeNumber = Number(take);
        if (isNaN(takeNumber) || takeNumber <= 0) {
            return next({ status: 400, message: "올바른 take 값이 필요합니다." });
        }
        const comments = yield prismaClient_1.default.comment.findMany({
            take: takeNumber,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: String(cursor) } : undefined,
            where: {
                articleId: articleId || undefined,
                productId: productId || undefined,
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: { select: { id: true, nickname: true } },
            },
        });
        res.status(200).json({ success: true, data: comments });
    }
    catch (error) {
        next(error);
    }
});
exports.getComments = getComments;
const addComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content } = req.body;
        const { articleId, productId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next({ status: 401, message: "로그인이 필요합니다." });
        }
        if (!articleId && !productId) {
            return next({
                status: 400,
                message: "게시글 또는 상품 ID가 필요합니다.",
            });
        }
        if (!(content === null || content === void 0 ? void 0 : content.trim())) {
            return next({ status: 400, message: "댓글 내용을 입력해주세요." });
        }
        const createData = {
            content,
            userId,
        };
        if (articleId) {
            createData.articleId = articleId;
        }
        else if (productId) {
            createData.productId = productId;
        }
        const comment = yield prismaClient_1.default.comment.create({
            data: createData,
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: { select: { id: true, nickname: true } },
            },
        });
        res.status(201).json({ success: true, data: comment });
    }
    catch (error) {
        next(error);
    }
});
exports.addComment = addComment;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next({ status: 401, message: "로그인이 필요합니다." });
        }
        if (!(content === null || content === void 0 ? void 0 : content.trim())) {
            return next({ status: 400, message: "수정할 댓글 내용을 입력해주세요." });
        }
        const existingComment = yield prismaClient_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment) {
            return next({ status: 404, message: "댓글을 찾을 수 없습니다." });
        }
        if (existingComment.userId !== userId) {
            return next({ status: 403, message: "본인 댓글만 수정할 수 있습니다." });
        }
        const updatedComment = yield prismaClient_1.default.comment.update({
            where: { id: commentId },
            data: { content },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
        });
        res.status(200).json({ success: true, data: updatedComment });
    }
    catch (error) {
        next(error);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { commentId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next({ status: 401, message: "로그인이 필요합니다." });
        }
        const existingComment = yield prismaClient_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment) {
            return next({ status: 404, message: "댓글을 찾을 수 없습니다." });
        }
        if (existingComment.userId !== userId) {
            return next({ status: 403, message: "본인 댓글만 삭제할 수 있습니다." });
        }
        yield prismaClient_1.default.comment.delete({ where: { id: commentId } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteComment = deleteComment;
