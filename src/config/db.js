import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const url = process.env.DATABASE_URL;
    await mongoose.connect(url);
    console.log("✅ MongoDB Atlas 연결 성공!");
  } catch (error) {
    console.error("❌ MongoDB Atlas 연결 실패:", error);
  }
};

export default connectDB;
