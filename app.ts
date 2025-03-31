import * as dotenv from "dotenv";
import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.ts";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./swagger.ts";

const port = process.env.PORT || 5004;
// 포트 종료

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/uploads",express.static("public/uploads"));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://panda-market-hyuk.vercel.app/"], // 프론트엔드 주소
    credentials: true, // 쿠키 허용 (필요하면)
  })
);

app.use("/", router);

app.use(errorHandler);

setupSwagger(app); // Swagger 설정 적용

app
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("Swagger docs available at http://localhost:5004/api-docs");
  })
  .on("error", (err) => {
    const error = err as unknown as NodeJS.ErrnoException;
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${port} is already in use. Trying another port...`);
      process.exit(1);
    }
  });
