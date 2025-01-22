import {
    createCommentService,
    getCommentsService,
    updateCommentService,
    deleteCommentService,
} from '../services/commentService.js';

export const createComment = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { content } = req.body;
        const comment = await createCommentService({ articleId, content });
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { cursor } = req.query;
        const comments = await getCommentsService({ articleId, cursor });
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const updatedComment = await updateCommentService({ id, content });
        res.status(200).json(updatedComment);
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteCommentService({ id });
        res.status(200).end();
    } catch (err) {
        next(err);
    }
};
