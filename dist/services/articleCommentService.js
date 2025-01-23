"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentService = exports.updateCommentService = exports.getCommentService = exports.createCommentService = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const createCommentService = async ({ articleId, content }) => {
    return prismaClient_1.default.articleComment.create({
        data: {
            content,
            Article: { connect: { id: Number(articleId) }, }
        }
    });
};
exports.createCommentService = createCommentService;
const getCommentService = async ({ articleId, cursor, isDesc, takeCount }) => {
    const take = Number(takeCount) || 10;
    const where = { articleId: Number(articleId) };
    const order = isDesc ? 'desc' : 'asc';
    const query = cursor
        ? { skip: 1, cursor: { id: Number(cursor) } }
        : { skip: 0 };
    return prismaClient_1.default.articleComment.findMany({
        where,
        take,
        ...query,
        orderBy: { createdAt: order }
    });
};
exports.getCommentService = getCommentService;
const updateCommentService = async ({ id, content }) => {
    return prismaClient_1.default.articleComment.update({
        where: { id: Number(id) },
        data: { content },
    });
};
exports.updateCommentService = updateCommentService;
const deleteCommentService = async ({ id }) => {
    return prismaClient_1.default.articleComment.delete({
        where: { id: Number(id) },
    });
};
exports.deleteCommentService = deleteCommentService;
