import express from "express";
import articleController from "./controllers/article.controller";
import { authenticateJWT } from "../../middlewares/auth.middleware";
import { validateReq } from "../../middlewares/validator.middleware";
import favoriteController from "../favorite/controllers/favorite.controller";
import {
  articleBaseValidationRules,
  articlePaginationRules,
} from "../../middlewares/article.middleware";
import { requestHandler } from "../../utils/requestHandler";
import commentRouter from "../comment/comment.routes";

const articleRouter = express.Router();

articleRouter.get(
  "/",
  articlePaginationRules,
  validateReq,
  requestHandler(articleController.getArticleList)
);

articleRouter.use(authenticateJWT);
articleRouter.post(
  "/",
  articleBaseValidationRules,
  validateReq,
  requestHandler(articleController.createArticle)
);

articleRouter.get(
  "/:articleId",
  requestHandler(articleController.getArticleDetail)
);
articleRouter.patch(
  "/:articleId",
  articleBaseValidationRules,
  validateReq,
  requestHandler(articleController.patchArticle)
);
articleRouter.delete(
  "/:articleId",
  requestHandler(articleController.deleteArticle)
);

articleRouter.post(
  "/:articleId/like",
  requestHandler(favoriteController.createArticleFavorite)
);
articleRouter.delete(
  "/:articleId/like",
  requestHandler(favoriteController.deleteArticleFavorite)
);

articleRouter.use("/:articleId/comments", commentRouter);
articleRouter.use("/:articleId/comments", commentRouter);

export default articleRouter;
