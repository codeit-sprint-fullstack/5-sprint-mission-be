import express from "express";
import { requestHandler } from "../../utils/requestHandler";
import { authenticateJWT } from "../../middlewares/auth.middleware";
import { validateReq } from "../../middlewares/validator.middleware";
import { commentBaseValidationRules } from "../../middlewares/comment.middleware";
import commentController from "./controllers/comment.controller";

const commentRouter = express.Router({ mergeParams: true });

// commentRouter.use(authenticateJWT);

commentRouter.post(
  "/",
  commentBaseValidationRules,
  validateReq,
  requestHandler(commentController.createComment)
);
commentRouter.get("/", requestHandler(commentController.getCommentList));

commentRouter.patch(
  "/:commentId",
  commentBaseValidationRules,
  validateReq,
  requestHandler(commentController.patchComment)
);
commentRouter.delete(
  "/:commentId",
  requestHandler(commentController.deleteComment)
);

export default commentRouter;
