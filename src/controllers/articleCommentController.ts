import { createCommentService, deleteCommentService, updateCommentService, getCommentService } from "../services/articleCommentService";
import {NextFunction, Request, Response} from "express";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { articleId } = req.params;
        const { content } = req.body;
        const comment = await createCommentService({ articleId, content });
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    }
}

interface GetCommentQuery {
    articleId: string;
    isDesc?: boolean;
    cursor?: string;
    takeCount?: string;
}
export const getComment = async (req: Request<GetCommentQuery>, res: Response, next: NextFunction) => {
    try {
        const { articleId, isDesc, takeCount } = req.params;
        const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
        const comment = await getCommentService({ articleId, cursor, isDesc, takeCount });
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const comment = await updateCommentService({ id, content });
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const comment = await deleteCommentService({ id });
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    }
}