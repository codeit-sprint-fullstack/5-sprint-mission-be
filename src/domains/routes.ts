import express from "express";
import authRouter from "./auth/auth.routes";
import productRoutes from "./product/product.routes";
// import articleRoutes from "./articles/articles.routes";
import commentRoutes from "./comment/comment.routes";
// import favoriteRoutes from "./favorites/favorites.routes";

const router = express.Router();

// 각 도메인별 라우트 등록
router.use("/auth", authRouter);
router.use("/products", productRoutes);
router.use("/comments", commentRoutes);
// 건강 체크 엔드포인트 (선택적)
router.get(`/health`, (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 기본 엔드포인트 (선택적)
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to eunbi's Panda market",
  });
});

// 404 처리 (선택적)
router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
