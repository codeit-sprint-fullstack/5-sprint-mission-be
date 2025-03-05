import express, { Request, Response, NextFunction } from "express";
import router from "./routes/index";
import { errorHandler } from "./middlewares/index";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// 모든 출처를 허용하거나, 필요한 출처만 허용할 수 있습니다.
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // 프론트엔드 URL 지정
    methods: ["GET", "POST", "PATCH", "DELETE"], // 허용할 HTTP 메서드
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router); // 라우터 세팅
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
}); // 에러 처리

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});

export default app;
