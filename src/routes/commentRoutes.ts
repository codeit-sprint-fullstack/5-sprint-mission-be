import { getComment, createComment, deleteComment, updateComment} from "../controllers/commentController";
import express from "express";

const router = express.Router();

router.post('/:articleId', createComment)
router.get('/:articleId', getComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;