import { getComment, createComment, deleteComment, updateComment} from "../controllers/articleCommentController";
import express from "express";

const router = express.Router();

router.post('/:articleId', createComment)
router.get('/:articleId', getComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;