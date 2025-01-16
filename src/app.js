import connectDB from './database/mongodb.js';
import express from 'express';
import productRoutes from './routes/product.routes.js';

connectDB()

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(productRoutes);

app.listen(PORT, () => {
    console.log(`서버 작동중:${PORT}`);
});