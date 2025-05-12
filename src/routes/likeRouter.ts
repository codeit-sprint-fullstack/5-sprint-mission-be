import likeController from "@/controllers/likeController";
import { validate } from "@/middleware/validate";
import { likeParamSchema } from "@/validators/likeValidator";
import { Router } from "express";

const router = Router({ mergeParams: true })

router.post(
  "/",
  validate({ params: likeParamSchema }),
  likeController.postArticleLike
)

router.delete(
  "/",
  validate({ params: likeParamSchema}),
  likeController.deleteArticleLike
)

export default router;