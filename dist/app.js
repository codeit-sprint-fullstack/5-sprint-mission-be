"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const database_1 = require("./config/database");
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const articleRouter_1 = __importDefault(require("./routes/articleRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const commentRouter_1 = __importDefault(require("./routes/commentRouter"));
const imageRouter_1 = __importDefault(require("./routes/imageRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = require("connect-redis");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const redisClient = new ioredis_1.default(process.env.REDIS_URL);
redisClient.on("connect", () => {
    console.log("✅ Redis 연결 성공!");
});
redisClient.on("error", (err) => {
    console.error("❌ Redis 연결 실패:", err);
});
// RedisStore 인스턴스 생성
const store = new connect_redis_1.RedisStore({
    client: redisClient,
});
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Set-Cookie"], // 쿠키 헤더 노출
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"] // 허용 헤더 추가
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
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
}));
app.use("/articles", articleRouter_1.default);
app.use("/products", productRouter_1.default);
app.use("/comments", commentRouter_1.default);
app.use("/auth", authRouter_1.default);
app.use("/users", userRouter_1.default);
app.use("/images", imageRouter_1.default);
app.use(errorMiddleware_1.errorMiddleware);
const PORT = process.env.PORT || 3000;
async function start() {
    await (0, database_1.connectDB)();
    app.listen(PORT, () => console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`));
}
start();
exports.default = app;
