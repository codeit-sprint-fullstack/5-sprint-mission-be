import express from 'express';
import {
    createArticle,
    getArticle,
    deleteArticle,
    updateArticle,
    getArticleList
} from "../controllers/articleController";

const router = express.Router();

router.post('/', createArticle);
router.get('/:id', getArticle);
router.get('/', getArticleList);
router.patch('/:id', updateArticle);
router.delete('/:id', deleteArticle);

export default router;