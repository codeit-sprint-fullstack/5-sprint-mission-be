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
  prefix: "sess:", // 선택사항
});

app.use(express.json());
app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS 환경에서는 true
      maxAge: 1000 * 60 * 60, // 1시간
    },
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
