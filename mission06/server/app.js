import express from 'express';
import router from './routes/index.js';
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';

const app = express();

app.use(express.json());

app.use("/", router);
app.listen(3000, () => console.log('Server Started'));

mongoose.connect(DATABASE_URL).then(() => console.log("connected to DB"));