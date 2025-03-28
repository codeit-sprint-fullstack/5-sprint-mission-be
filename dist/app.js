import * as dotenv from "dotenv";
import express from "express";
import router from "./routes/index.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // 프론트엔드 주소
    credentials: true, // 쿠키 허용 (필요하면)
}));
app.use('/', router);
const port = process.env.PORT || 5004;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    const error = err;
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Trying another port...`);
        process.exit(1);
    }
});
