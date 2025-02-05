import express from 'express';
import { createArticle, getArticles } from '../controllers/articleController.js';

const router = express.Router();

router.post('/', createArticle);
router.get('/', getArticles);

export default router;
