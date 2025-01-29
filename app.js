import express from "express";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import router from "./routes/index.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

// Prisma 클라이언트 생성
const prisma = new PrismaClient();

// Express 애플리케이션 생성
const app = express();

// 미들웨어 설정
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: "*",
  })
);

app.use(express.json());

app.use("/", router);

app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
