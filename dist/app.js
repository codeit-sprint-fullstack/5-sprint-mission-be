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
const express_session_1 = __importDefault(require("express-session"));
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = require("connect-redis");
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
    prefix: "sess:", // 선택사항
});
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // HTTPS 환경에서는 true
        maxAge: 1000 * 60 * 60, // 1시간
    },
}));
app.use("/articles", articleRouter_1.default);
app.use("/products", productRouter_1.default);
app.use("/comments", commentRouter_1.default);
app.use("/auth", authRouter_1.default);
app.use(errorMiddleware_1.errorMiddleware);
const PORT = process.env.PORT || 3000;
async function start() {
    await (0, database_1.connectDB)();
    app.listen(PORT, () => console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`));
}
start();
exports.default = app;
