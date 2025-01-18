import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("몽고디비 연결 성공");
    } catch (error) {
        console.error("몽고디비 연결 실패:", error);
        process.exit(1);
    }
}

export default connectDB;