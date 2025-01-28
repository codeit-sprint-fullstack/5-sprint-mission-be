import express from "express";
import service from "./service.js";

const router = express.Router();

router.post("/", service.postNewProduct);

export default router;
