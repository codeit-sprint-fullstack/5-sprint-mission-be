import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

//로컬호스트 주소, 프론트 배포할 주소 추가하기
const corsOptions = {
  origin: ["http://localhost:3000", "https://pandamarket-hoeun.netlify.app/"],
};

app.use(cors(corsOptions));
app.use(express.json()); //api 사용할 때 json형식을 사용할 수 있게 해줌

//몽구스랑 연결
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("몽고디비 연결 성공~"))
  .catch((e) => console.log(e));

app.use("/", router);

//서버 시작(포트번호, 포트가 열렸을 때(서버 실행하고나서) 실행되는 함수)
app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});
