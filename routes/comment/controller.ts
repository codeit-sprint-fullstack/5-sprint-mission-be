import express from "express";
import service from "./service.ts";
import auth from "../../middleware/auth.ts";

const router = express.Router();

router
  .route("/:id")
  .get(service.getCommentList)
  .delete(
    auth.verifyAccessToken,
    auth.verifyCommentChange,
    service.deleteComment
  )
  .patch(
    auth.verifyAccessToken,
    auth.verifyCommentChange,
    service.patchComment
  );

router.post(
  "/article/:articleId",
  auth.verifyAccessToken,
  service.postCommentArticle
);
router.post(
  "/product/:productId",
  auth.verifyAccessToken,
  service.postCommentProduct
);

export default router;
