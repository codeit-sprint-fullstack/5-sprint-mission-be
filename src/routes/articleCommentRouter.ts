import commentController from "@/controllers/commentController";
import { validate } from "@/middleware/validate";
import {
  commentBodySchema,
  commentParamSchema,
  commentQuerySchema,
} from "@/validators/commentValidator";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.get(
  "/",
  validate({ query: commentQuerySchema, params: commentParamSchema }),
  commentController.getArticleCommentList
);

router.post(
  "/",
  validate({ params: commentParamSchema, body: commentBodySchema }),
  commentController.postArticleComment
);

export default router;
