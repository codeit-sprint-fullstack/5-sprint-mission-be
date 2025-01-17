import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: "../.env"});

const MONGO_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MONGODB 접속 성공');
    } catch (err) {
        console.error('MONGODB 접속 실패', err);
        process.exit(1);
    }
};

export default connectDB;