import articleController from "@/controllers/articleController";
import { validate } from "@/middleware/validate";
import {
  articleParamSchema,
  getArticleListQuerySchema,
  articlePostAndPatchBodySchema,
} from "@/validators/articleValidator";
import { Router } from "express";
import commentRouter from "@/routes/articleCommentRouter";
import likeRouter from "@/routes/likeRouter";

const router = Router();

router.get(
  "/",
  validate({ query: getArticleListQuerySchema }),
  articleController.getArticleList
);
router.get(
  "/:id",
  validate({ params: articleParamSchema }),
  articleController.getArticleById
);
router.post(
  "/",
  validate({ body: articlePostAndPatchBodySchema }),
  articleController.postArticle
);

router.delete(
  "/:id",
  validate({ params: articleParamSchema }),
  articleController.deleteArticle
);

router.patch(
  "/:id",
  validate({ params: articleParamSchema, body: articlePostAndPatchBodySchema }),
  articleController.updateArticle
);

router.use("/:articleId/comments", commentRouter);
router.use("/:articleId/like", likeRouter);
export default router;
