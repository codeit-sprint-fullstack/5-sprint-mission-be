import * as dotenv from "dotenv";
import express from "express";
import router from "./routes/index.js"
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple"; // 세션 관리해줌
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const app = express();
const PgStore = pgSession(session);

// PostgreSQL 연결 풀 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // .env에서 불러오기
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 주소
    credentials: true, // 쿠키 허용 (필요하면)
  })
);

app.use('/',router);

app.use(
  session({
    store: new PgStore({
      pool, // PostgreSQL 연결
      tableName: "session", // 세션 테이블 이름
    }),
    secret: "your_secret_key", // 환경 변수로 관리하는 게 좋음
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1시간 유지
  })
);


const port = process.env.PORT || 5004;

app.listen(port, () => console.log(`Server Started :${port}`));