import * as dotenv from "dotenv";
import prisma from "./prismaClient.js";
import express from "express";
import { assert } from "superstruct";
import { CreateUser } from "./structs.js";
dotenv.config();

const app = express();
app.use(express.json());

// app.get("/users", async (req, res) => {

// });

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));
