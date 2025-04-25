import commentController from "@/controllers/commentController";
import { validate } from "@/middleware/validate";
import {
  commentBodySchema,
  commentParamSchema,
} from "@/validators/commentValidator";
import { Router } from "express";

const router = Router();

router.patch(
  "/:id",
  validate({ params: commentParamSchema, body: commentBodySchema }),
  commentController.patchComment
);

router.delete(
  "/:id",
  validate({ params: commentParamSchema }),
  commentController.deleteComment
);

export default router;