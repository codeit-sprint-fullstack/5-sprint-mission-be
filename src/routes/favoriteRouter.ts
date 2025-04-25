import favoriteController from "@/controllers/favoriteController";
import { validate } from "@/middleware/validate";
import { favoriteParamSchema } from "@/validators/favoriteValidator";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate({ params: favoriteParamSchema }),
  favoriteController.postProductFavorite
);

router.delete(
  "/",
  validate({ params: favoriteParamSchema }),
  favoriteController.deleteProductFavorite
);

export default router;
