// Express 서버 메인 설정 파일
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { seedDatabase } from "./config/seed.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB 연결
connectDB().then(() => {
  // 개발 환경에서만 시딩 실행
  if (process.env.NODE_ENV === "development") {
    seedDatabase();
  }
});

// 라우터 연결
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버 실행중: http://localhost:${PORT}`));
