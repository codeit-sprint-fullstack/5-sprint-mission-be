import express from "express";

import {
  productFunctions,
  commentFunctions,
} from "../prisma/Products/index.js";

const productsRouter = express.Router();
productsRouter.get("/", productFunctions.getProducts);
productsRouter.get("/:id", productFunctions.getProductById);
productsRouter.post("/", productFunctions.createProduct);
productsRouter.patch("/:id", productFunctions.updateProduct);
productsRouter.delete("/:id", productFunctions.deleteProduct);

productsRouter.get(
  "/:productId/comments",
  commentFunctions.getCommentsByProductId
);

productsRouter.get(
  "/:productId/comments/:commentId",
  commentFunctions.getCommentById
);

productsRouter.post("/:productId/comments", commentFunctions.createComment);

productsRouter.patch(
  "/:productId/comments/:commentId",
  commentFunctions.updateComment
);

productsRouter.delete(
  "/:productId/comments/:commentId",
  commentFunctions.deleteComment
);

export default productsRouter;
