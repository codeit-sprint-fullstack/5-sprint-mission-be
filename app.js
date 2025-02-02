//import prisma from "./prismaClient.js";
// import { assert } from "superstruct";
// import { CreateUser } from "./structs.js";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import articleRoutes from "./routes/article/controller.js";
import commentRoutes from "./routes/comment/controller.js";

dotenv.config();

const app = express();
app.use(express.json());

//라우터 사용
app.use("/article", articleRoutes);
app.use("/comment", commentRoutes);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});
