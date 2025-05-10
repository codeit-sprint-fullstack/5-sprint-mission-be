import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./server/routes/index";
import errorHandler from "./server/middlewares/errorHandler";
import { specs, swaggerUi } from "./server/config/swaggerConfig";
import path from "path";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/", routes);

app.use(errorHandler);

export default app;
