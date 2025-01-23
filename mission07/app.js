import * as dotenv from "dotenv";

dotenv.config();

import express from "express";
import router from "./routes/index.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

// "/"로 시작하는 요청에서 미들웨어 실행
app.use("/", router);

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
