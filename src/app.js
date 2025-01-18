import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import connectDB from "./database/mongodb.js";

dotenv.config({ path: '../.env'});
const PORT = process.env.PORT || 5000;

const app = express();

connectDB()

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '서버 내부 오류' });
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
