import express from "express";
import service from "./service.js";
import authMiddleware from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", service.getArticleList);
router.get("/:id", service.getArticle);

// 인증 필요
router.post("/", authMiddleware.verifySessionLogin, service.createArticle);
router.patch("/:id", authMiddleware.verifySessionLogin, service.patchArticle);
router.delete("/:id", authMiddleware.verifySessionLogin, service.deleteArticle);
// router.post("/:id/like", authMiddleware.verifySessionLogin, service.createLike);
// router.delete(
//   "/:id/like",
//   authMiddleware.verifySessionLogin,
//   service.deleteLike
// );

export default router;
