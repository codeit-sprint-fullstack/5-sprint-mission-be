"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleList = exports.getArticle = exports.createArticle = void 0;
const articleService_1 = require("../services/articleService");
const createArticle = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const article = await (0, articleService_1.createArticleService)({ title, content });
        res.status(200).json(article);
    }
    catch (error) {
        next(error);
    }
};
exports.createArticle = createArticle;
const getArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await (0, articleService_1.getArticleService)({ id });
        res.status(200).json(article);
    }
    catch (error) {
        next(error);
    }
};
exports.getArticle = getArticle;
const getArticleList = async (req, res, next) => {
    try {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const article = await (0, articleService_1.getArticleListService)({ page, pageSize });
        res.status(200).json(article);
    }
    catch (error) {
        next(error);
    }
};
exports.getArticleList = getArticleList;
const updateArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const article = await (0, articleService_1.updateArticleService)({ id, title, content });
        res.status(200).json(article);
    }
    catch (error) {
        next(error);
    }
};
exports.updateArticle = updateArticle;
const deleteArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await (0, articleService_1.deleteArticleService)({ id });
        res.status(200).json("삭제가 완료되었습니다.");
    }
    catch (error) {
        next(error);
    }
};
exports.deleteArticle = deleteArticle;
