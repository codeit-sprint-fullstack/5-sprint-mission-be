import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from "dotenv";

import errorHandler from './utils/errorHandler'
import articleRoutes from './routes/articleRoutes';
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config({ path: '../.env'});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);

app.use('/product', productRoutes);
app.use('/article', articleRoutes);
app.use('/comment', commentRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`서버 작동중 ${process.env.PORT || 3000}`);
});

export default app;