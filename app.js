import express from "express";
import mongoose from "mongoose";
import router from "./routes/index.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// npm install dotenv
// punycode 이 오류는 안사라지네..

const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("몽고디비 연결 성공^^"))
  .catch((err) => console.log(err));

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
