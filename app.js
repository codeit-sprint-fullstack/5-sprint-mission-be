import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";

dotenv.config();

const app = express();

//FIXME: 프론트 배포할 주소 수정하기
const corsOptions = {
  origin: ["http://localhost:3000", "https://pandamarket-next-rhe.netlify.app"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", router);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));
