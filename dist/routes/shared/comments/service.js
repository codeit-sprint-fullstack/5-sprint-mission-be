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
const prismaClient_1 = __importDefault(require("../../../prismaClient"));
// 댓글 작업 실행 함수
const executeCommentOperation = (table, operation, params) => __awaiter(void 0, void 0, void 0, function* () {
    const client = prismaClient_1.default[table];
    return client[operation](params);
});
const getFieldType = (type) => {
    if (type === "articles") {
        return {
            commentTable: "articleComment",
            mainTable: "article",
            idField: "articleId",
        };
    }
    else {
        return {
            commentTable: "productComment",
            mainTable: "product",
            idField: "productId",
        };
    }
};
// 전체 댓글 목록 조회
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const domainId = req.params.domainId;
        const { lastCursor, type } = req.query;
        const { commentTable, idField } = getFieldType(type);
        const pagination = lastCursor
            ? { skip: 1, cursor: { id: lastCursor } }
            : { skip: 0 };
        const comments = yield executeCommentOperation(commentTable, "findMany", Object.assign(Object.assign({ where: {
                [idField]: domainId,
                deletedAt: null,
            }, orderBy: { createdAt: "desc" }, take: 10 }, pagination), { select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            } }));
        const formattedComments = comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            writer: {
                id: comment.userId,
                nickname: comment.User.nickname,
            },
        }));
        res.status(200).send({
            status: 200,
            idField,
            commentsList: formattedComments,
            lastCursor: (_b = (_a = comments[formattedComments.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
        });
    }
    catch (error) {
        next(error);
    }
});
// 댓글 등록
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const domainId = req.params.domainId;
        const { type } = req.query;
        const { content } = req.body;
        const { commentTable, mainTable, idField } = getFieldType(type);
        const { id: userId, nickname: userNickname } = req.user;
        // 게시글/상품이 존재하는지 먼저 확인
        const client = prismaClient_1.default[mainTable];
        const domain = yield client.findFirst({
            where: {
                id: domainId,
                deletedAt: null,
            },
        });
        if (!domain) {
            const error = new Error(type === "articles"
                ? "존재하지 않는 게시글입니다."
                : "존재하지 않는 상품입니다.");
            error.code = 404;
            error.name = "NotFoundError";
            throw error;
        }
        const newComment = yield executeCommentOperation(commentTable, "create", {
            data: {
                content,
                User: {
                    connect: {
                        id: userId,
                    },
                },
                [type === "articles" ? "Article" : "Product"]: {
                    connect: {
                        id: domainId,
                    },
                },
            },
            include: {
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        const response = {
            id: newComment.id,
            content: newComment.content,
            createdAt: newComment.createdAt,
            updatedAt: newComment.updatedAt,
            writer: {
                id: userId,
                nickname: userNickname,
            },
        };
        res.status(201).send(response);
    }
    catch (error) {
        next(error);
    }
});
// 댓글 수정
const patchComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const id = req.params.id;
        const { type } = req.query;
        const { content } = req.body;
        const { commentTable } = getFieldType(type);
        const { id: userId, nickname: userNickname } = req.user;
        const existingComment = yield executeCommentOperation(commentTable, "findUnique", {
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingComment) {
            res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
            return;
        }
        // 댓글 작성자와 현재 사용자가 일치하는지 확인
        if (existingComment.userId !== userId) {
            const error = new Error("댓글 수정 권한이 없습니다.");
            error.name = "ForbiddenError";
            throw error;
        }
        const updatedComment = yield executeCommentOperation(commentTable, "update", {
            where: { id },
            data: { content },
        });
        const response = {
            id: updatedComment.id,
            content: updatedComment.content,
            createdAt: updatedComment.createdAt,
            updatedAt: updatedComment.updatedAt,
            writer: {
                id: userId,
                nickname: userNickname,
            },
        };
        res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
});
// 댓글 삭제
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const id = req.params.id;
        const { type } = req.query;
        const { commentTable } = getFieldType(type);
        const userId = req.user.id;
        const existingComment = yield executeCommentOperation(commentTable, "findUnique", {
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingComment) {
            res.status(404).send({ message: "댓글을 찾을 수 없습니다." });
            return;
        }
        // 댓글 작성자와 현재 사용자가 일치하는지 확인
        if (existingComment.userId !== userId) {
            const error = new Error("댓글 삭제 권한이 없습니다.");
            error.name = "ForbiddenError";
            throw error;
        }
        const deletedComment = yield executeCommentOperation(commentTable, "update", {
            where: { id },
            data: { deletedAt: new Date() },
            select: {
                id: true,
                content: true,
                deletedAt: true,
            },
        });
        if (!deletedComment) {
            const error = new Error("댓글을 삭제할 수 없습니다.");
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
const service = {
    getComments,
    createComment,
    patchComment,
    deleteComment,
};
exports.default = service;
//# sourceMappingURL=service.js.map