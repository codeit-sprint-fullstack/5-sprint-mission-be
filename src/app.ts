import * as dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import router from "./routes/index";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app: Express = express();

const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:3000", "https://panda-next-hoeun.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// 정적 파일 제공을 위한 미들웨어 추가
app.use("/uploads", express.static("uploads"));
app.use("/", router);
// 모든 라우터 정의 후에 에러 핸들러 미들웨어 추가 - 모든 에러 일관되게 처리
app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));
