import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import Router from "./domains/routes";
import { setupSwagger } from "./swagger";
dotenv.config();

const app = express();
app.use(express.json());
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
app.use(
  cors({
    origin: clientUrl,
    //credentials: true, // 쿠키를 주고받기 위해 필요
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
setupSwagger(app);
app.use("/", Router);

export default app;
