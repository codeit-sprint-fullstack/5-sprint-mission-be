import express from 'express';
import {
    createComment,
    getComments,
    updateComment,
    deleteComment,
} from '../controllers/commentController.js';

const router = express.Router();

// 게시판 댓글
router.post('/articles/:articleId', createComment);
router.get('/articles/:articleId', getComments);

// 댓글 수정 및 삭제
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
