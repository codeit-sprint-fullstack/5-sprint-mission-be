import express from "express";
import service from "./service.js";
import commentService from "./comments/service.js";

const router = express.Router();

router.get("/", service.getProductList);
router.get("/:id", service.getProduct);
router.post("/", service.createProduct);
router.patch("/:id", service.patchProduct);
router.delete("/:id", service.deleteProduct);

//FIXME: 여기를 파트로 볼지 서비스로 볼지
router.get("/comments/:domainId", commentService.getComments);
router.post("/comments/:domainId", commentService.createComment);
router.patch("/comments/:id", commentService.patchComment);
router.delete("/comments/:id", commentService.deleteComment);

export default router;
