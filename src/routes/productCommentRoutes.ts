import { getComment, createComment, deleteComment, updateComment} from "../controllers/productCommentController";
import express from "express";

const router = express.Router();

router.post('/:productId', createComment)
router.get('/:productId', getComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;