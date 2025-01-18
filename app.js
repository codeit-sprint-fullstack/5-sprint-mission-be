import mongoose from "mongoose";
import express from "express";
import * as dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";

dotenv.config();

const { DATABASE_URL } = process.env;

const app = express();
const PORT = 8007;

const corsOptions = {
  origin: [
    "http://127.0.0.1:8007",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3000",
  ],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://127.0.0.1:3000");
  res.send(data);
});

app.use(express.json());
app.use("/", router);

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("몽고디비 연결 성공^^"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("서버가 정상적으로 동작중입니다!");
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
