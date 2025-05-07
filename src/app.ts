import "module-alias/register";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { connectDB } from "./config/database";
import authRouter from "./routes/authRouter";
import articleRouter from "./routes/articleRouter";
import productRouter from "./routes/productRouter";
import commentRouter from "./routes/commentRouter";
import imgUploadRouter from "./routes/imageRouter"
import userRouter from "./routes/userRouter";
import session from "express-session";
import Redis from "ioredis";
import { RedisStore } from "connect-redis";
import cors from "cors"

dotenv.config();
const app = express();
const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on("connect", () => {
  console.log("✅ Redis 연결 성공!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis 연결 실패:", err);
});
// RedisStore 인스턴스 생성
const store = new RedisStore({
  client: redisClient,
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  exposedHeaders: ["Set-Cookie"], // 쿠키 헤더 노출
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"] // 허용 헤더 추가
}))
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS가 아니면 false
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 또는 "none" (HTTPS 필수)
      maxAge: 1000 * 60 * 60,
      // domain: "localhost" → 삭제! (로컬 개발에선 설정하지 않음)
    },
    saveUninitialized: false, // 변경: false로 설정
    resave: false, // 변경: false로 설정
  })
);
app.use("/articles", articleRouter);
app.use("/products", productRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/images", imgUploadRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
async function start() {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`)
  );
}

start();

export default app;
