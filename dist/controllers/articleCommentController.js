"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getComment = exports.createComment = void 0;
const articleCommentService_1 = require("../services/articleCommentService");
const createComment = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { content } = req.body;
        const comment = await (0, articleCommentService_1.createCommentService)({ articleId, content });
        res.status(200).send(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.createComment = createComment;
const getComment = async (req, res, next) => {
    try {
        const { articleId, isDesc, takeCount } = req.params;
        const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
        const comment = await (0, articleCommentService_1.getCommentService)({ articleId, cursor, isDesc, takeCount });
        res.status(200).send(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.getComment = getComment;
const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const comment = await (0, articleCommentService_1.updateCommentService)({ id, content });
        res.status(200).send(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await (0, articleCommentService_1.deleteCommentService)({ id });
        res.status(200).send(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteComment = deleteComment;
