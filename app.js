import mongoose from "mongoose";
import express from "express";
import { DATABASE_URL } from "./env.js";
import router from "./routes/index.js";

import cors from "cors";
const app = express();
const PORT = 8007;
app.use(cors());
app.use(express.json());
const corsOptions = {
  origin: ["http://127.0.0.1:3000", "render.com"],
};

app.use(cors(corsOptions));
app.use("/", router);

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("몽고디비 연결 성공^^"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("서버가 정상적으로 동작중입니다!");
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
