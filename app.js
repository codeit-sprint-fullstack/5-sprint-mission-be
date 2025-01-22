import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

const DATABASE_URL = process.env.DB_URL;
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("몽고디비 연결 성공^^"))
  .catch((err) => console.log(err));

// 포트 설정
const PORT = 8000;

app.use("/", router);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
