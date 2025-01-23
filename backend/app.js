import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { DATABASE_URL } from "./env.js";
import service from "./routes/product/service.js";
import productRouter from "./routes/product/controller.js";

const app = express();
app.use(express.json());
app.use(cors());
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("몽고디비 연결 성공~"))
  .catch((err) => console.log(err));

app.use("/product", productRouter);

// //1. 상품 등록 API를 만들어 주세요.
// app.post("/product", service.postProduct);

// //2. 상품 상세 조회 API를 만들어 주세요.
// app.get("/product/:id", service.getProduct);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
