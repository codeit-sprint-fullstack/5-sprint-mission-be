"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticleService = exports.updateArticleService = exports.getArticleListService = exports.getArticleService = exports.createArticleService = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const createArticleService = async ({ title, content }) => {
    return prismaClient_1.default.article.create({
        data: { title, content },
    });
};
exports.createArticleService = createArticleService;
const getArticleService = async ({ id }) => {
    return prismaClient_1.default.article.findUnique({
        where: { id: Number(id) },
    });
};
exports.getArticleService = getArticleService;
const getArticleListService = async ({ page, pageSize }) => {
    const currentPage = Number(page) || 1;
    const currentPageSize = Number(pageSize) || 10;
    const skip = (currentPage - 1) * currentPageSize;
    return prismaClient_1.default.article.findMany({
        skip: skip || 0,
        orderBy: { createdAt: "desc" },
        take: currentPageSize,
    });
};
exports.getArticleListService = getArticleListService;
const updateArticleService = async ({ id, title, content }) => {
    const data = {};
    if (title)
        data.title = title;
    if (content)
        data.content = content;
    return prismaClient_1.default.article.update({
        where: { id: Number(id) },
        data: data,
    });
};
exports.updateArticleService = updateArticleService;
const deleteArticleService = async ({ id }) => {
    return prismaClient_1.default.article.delete({
        where: { id: Number(id) },
    });
};
exports.deleteArticleService = deleteArticleService;
