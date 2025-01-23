import {
    updateArticleService,
    createArticleService,
    getArticleService,
    getArticleListService,
    deleteArticleService,
} from "../services/articleService";
import {NextFunction, Request, Response} from "express";

export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content } = req.body;
        const article = await createArticleService({ title, content });
        res.status(200).json(article);
    } catch (error) {
        next(error);
    }
}

export const getArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const article = await getArticleService({ id });
        res.status(200).json(article);
    } catch (error) {
        next(error);
    }
}

export const getArticleList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page);
        const pageSize = Number(req.query.pageSize);
        const article = await getArticleListService({ page, pageSize });
        res.status(200).json(article);
    } catch (error) {
        next(error);
    }
}

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const article = await updateArticleService({id, title, content });
        res.status(200).json(article);
    } catch (error) {
        next(error);
    }
}

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const article = await deleteArticleService({id})
        res.status(200).json("삭제가 완료되었습니다.");
    } catch (error) {
        next(error);
    }
}