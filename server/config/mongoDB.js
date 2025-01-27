// mongoDB 환경 설정(config)
import dotenv from "dotenv";
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;

import mongoose from "mongoose";

// MongoDB 연결 함수
const connectDB = async () => {
  // 환경 변수 확인
  if (!DATABASE_URL) {
    console.error("DATABASE_URL is not defined in .env file");
    process.exit(1);
  }
  try {
    // Mongoose 설정 및 연결
    // "strictQuery" : 쿼리에서 스카미 정의에 따른 필드 확인, 보안 + 예측성 상승 효과
    // true : 쿼리에서 스키마에 정의되지 않은 필드 무시, false: 스키마에 정의도지 않은 필드도 포함
    console.log("mongoDB", DATABASE_URL);
    mongoose.set("strictQuery", true);
    await mongoose.connect(DATABASE_URL);
    console.log("MongoDB connected successfully");
    console.log("DATABASE_URL:", DATABASE_URL);
    console.log("PORT:", process.env.PORT);
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;
