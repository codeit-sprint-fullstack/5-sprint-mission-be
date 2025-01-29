import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

const app = express();
dotenv.config();


app.use(cors()); // 모든 출처에서 오는 요청 허용

app.use(express.json());

app.use('/', router);
app.listen(8000, () => console.log('Server Started'));

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('connected to DB'));
