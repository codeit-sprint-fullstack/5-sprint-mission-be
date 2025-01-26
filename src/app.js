import express from "express";
import connectDB from "./config/db.js";
import productRouter from "./routes/productRoutes.js";

const app = express();
const PORT = 5005;

app.use(express.json());

connectDB();

app.use("/product", productRouter);

app.listen(PORT, () =>
  console.log(`✅ 서버 실행 성공 http://localhost:${PORT}`)
);
