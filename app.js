import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import session from "express-session";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://panda-next-hoeun.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 유효기간 24시간
    },
  })
);
// 정적 파일 제공을 위한 미들웨어 추가
app.use("/uploads", express.static("uploads"));
app.use("/", router);
// 모든 라우터 정의 후에 에러 핸들러 미들웨어 추가 - 모든 에러 일관되게 처리
app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));
