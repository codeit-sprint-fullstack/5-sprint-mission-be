import productController from "@/controllers/productController";
import { validate } from "@/middleware/validate";
import {
  getProductListQuerySchema,
  productParamSchema,
  productPostAndPatchBodySchema,
} from "@/validators/productValidator";
import { Router } from "express";
import commentRouter from "@/routes/productCommentRouter";
import favoriteRouter from "@/routes/favoriteRouter";

const router = Router();
router.get(
  "/",
  validate({ query: getProductListQuerySchema }),
  productController.getProductList
);
router.get(
  "/:id",
  validate({ params: productParamSchema }),
  productController.getProductById
);
router.post(
  "/",
  validate({ body: productPostAndPatchBodySchema }),
  productController.postProduct
);
router.patch(
  "/:id",
  validate({ params: productParamSchema, body: productPostAndPatchBodySchema }),
  productController.updateProduct
);
router.delete(
  "/:id",
  validate({ params: productParamSchema }),
  productController.deleteProduct
);

router.use("/:productId/comments", commentRouter);
router.use("/:productId/favorite", favoriteRouter);

export default router;
