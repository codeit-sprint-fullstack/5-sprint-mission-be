import express from "express";
import service from "./service.js";
import auth from "../../middleware/auth.ts";
import favoriteRouter from "../favorite/controller.ts"
import commentRouter from "../comment/controller.ts";

const router = express.Router();

router.get("/", service.getProductList);
router.post("/", auth.verifyAccessToken, service.postProduct);
router.get("/:id", auth.verifyAccessToken, service.getProduct);
router.patch(
  "/:id",
  auth.verifyAccessToken,
  auth.verifyProductChange,
  service.patchProduct
);
router.delete(
  "/:id",
  auth.verifyAccessToken,
  auth.verifyProductChange,
  service.deleteProduct
);

router.use("/", favoriteRouter);

export default router;
