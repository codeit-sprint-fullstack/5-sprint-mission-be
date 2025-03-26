import express from "express";
import service from "./service.js";
import authMiddleware from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", service.getArticleList);
router.get("/:id", service.getArticle);

// 인증 필요
router.post("/", authMiddleware.verifyToken, service.createArticle);
router.patch("/:id", authMiddleware.verifyToken, service.patchArticle);
router.delete("/:id", authMiddleware.verifyToken, service.deleteArticle);
// router.post("/:id/like", authMiddleware.verifyToken, service.createLike);
// router.delete(
//   "/:id/like",
//   authMiddleware.verifyToken,
//   service.deleteLike
// );

export default router;
