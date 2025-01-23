"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentService = exports.updateCommentService = exports.getCommentService = exports.createCommentService = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const createCommentService = async ({ productId, content }) => {
    return prismaClient_1.default.productComment.create({
        data: {
            content,
            Product: { connect: { id: Number(productId) }, }
        }
    });
};
exports.createCommentService = createCommentService;
const getCommentService = async ({ productId, cursor, isDesc, takeCount }) => {
    const take = Number(takeCount) || 10;
    const where = { productId: Number(productId) };
    const order = isDesc ? 'desc' : 'asc';
    const query = cursor
        ? { skip: 1, cursor: { id: Number(cursor) } }
        : { skip: 0 };
    return prismaClient_1.default.productComment.findMany({
        where,
        take,
        ...query,
        orderBy: { createdAt: order }
    });
};
exports.getCommentService = getCommentService;
const updateCommentService = async ({ id, content }) => {
    return prismaClient_1.default.productComment.update({
        where: { id: Number(id) },
        data: { content },
    });
};
exports.updateCommentService = updateCommentService;
const deleteCommentService = async ({ id }) => {
    return prismaClient_1.default.productComment.delete({
        where: { id: Number(id) },
    });
};
exports.deleteCommentService = deleteCommentService;
