import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./server/config/mongoDB.js";
import routes from "./server/routes/index.js";

const app = express();

//미들웨어
app.use(cors());
app.use(express.json());

//라우터
app.use("/", routes);

//연결
const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

//전역 에러
app.use((err, req, res, next) => {
  console.error(err.stack); // 로그 출력
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
