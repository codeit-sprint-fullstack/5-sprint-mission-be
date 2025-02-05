// Express 서버 메인 설정 파일
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, pool } from "./config/db.js";
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
connectDB()
  .then(() => {
    console.log("데이터베이스 연결 및 테이블 생성 완료");
  })
  .catch((error) => {
    console.error("데이터베이스 연결 실패:", error);
    process.exit(1);
  });

// 라우터 연결
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

// 프로세스 종료 시 연결 풀 정리
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  server.close(async () => {
    console.log("HTTP server closed");
    await pool.end();
    process.exit(0);
  });
});

// 예기치 않은 에러 처리
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  server.close(async () => {
    await pool.end();
    process.exit(1);
  });
});
