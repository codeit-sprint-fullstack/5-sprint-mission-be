import { createCommentService, deleteCommentService, updateCommentService, getCommentService } from "../services/productCommentService";
import {NextFunction, Request, Response} from "express";
import {GetProductCommentQuery} from "../utils/interfaces";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const { content } = req.body;
        const comment = await createCommentService({ productId, content });
        res.status(200).send(comment);
    } catch (error) {
        next(error);
    }
}

export const getComment = async (req: Request<GetProductCommentQuery>, res: Response, next: NextFunction) => {
    try {
        const { productId, isDesc, takeCount } = req.params;
        const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
        const comment = await getCommentService({ productId, cursor, isDesc, takeCount });
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