import express, { Request, Response, NextFunction } from "express";
import router from "./routes/index";
import { errorHandler } from "./middlewares/index";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

console.log();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // 프론트엔드 URL 지정
    methods: ["GET", "POST", "PATCH", "DELETE"], // 허용할 HTTP 메서드
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
    credentials: true, // 자격 증명 허용
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
