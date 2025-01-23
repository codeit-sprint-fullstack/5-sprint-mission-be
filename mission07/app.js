import * as dotenv from "dotenv";
import express from "express";
import router from "./routes/index.js"
import prisma from "./prismaClient.js"

dotenv.config();

const app = express();
app.use(express.json());

app.use('/',router);

const port = process.env.PORT || 5004;

app.listen(port, () => console.log(`Server Started :${port}`));