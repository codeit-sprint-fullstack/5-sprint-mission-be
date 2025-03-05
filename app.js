import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://panda-next-hoeun.vercel.app"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", router);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));
