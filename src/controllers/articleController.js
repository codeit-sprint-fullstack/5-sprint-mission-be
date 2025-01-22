import { createArticleService, getArticlesService } from '../services/articleService.js';

export const createArticle = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const article = await createArticleService({ title, content });
        res.status(200).json(article);
    } catch (err) {
        next(err);
    }
};

export const getArticles = async (req, res, next) => {
    try {
        const articles = await getArticlesService(req.query);
        res.status(200).json(articles);
    } catch (err) {
        next(err);
    }
};
