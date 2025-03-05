"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const index_2 = require("./middlewares/index");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
console.log();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL, // 프론트엔드 URL 지정
    methods: ["GET", "POST", "PATCH", "DELETE"], // 허용할 HTTP 메서드
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
    credentials: true, // 자격 증명 허용
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", index_1.default); // 라우터 세팅
app.use((err, req, res, next) => {
    (0, index_2.errorHandler)(err, req, res, next);
}); // 에러 처리
exports.default = app;
