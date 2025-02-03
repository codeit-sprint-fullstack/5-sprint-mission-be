import express from "express";
import {
  articleFunctions,
  commentFunctions,
} from "../prisma/Articles/index.js";

const articlesRouter = express.Router();

articlesRouter.get("/", articleFunctions.getArticles);
articlesRouter.get("/:id", articleFunctions.getArticleById);
articlesRouter.post("/", articleFunctions.createArticle);
articlesRouter.patch("/:id", articleFunctions.updateArticle);
articlesRouter.delete("/:id", articleFunctions.deleteArticle);

articlesRouter.get(
  "/:articleId/comments",
  commentFunctions.getCommentsByArticleId
);

articlesRouter.get(
  "/:articleId/comments/:commentId",
  commentFunctions.getCommentById
);

articlesRouter.post("/:articleId/comments", commentFunctions.createComment);

articlesRouter.patch(
  "/:articleId/comments/:commentId",
  commentFunctions.updateComment
);

articlesRouter.delete(
  "/:articleId/comments/:commentId",
  commentFunctions.deleteComment
);

export default articlesRouter;
