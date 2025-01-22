import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";

dotenv.config();

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

// mongoDB 연결
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => "MongoDB 연결 성공")
  .catch((err) => console.log(err));

app.use("/", router);

// 서버 시작
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
