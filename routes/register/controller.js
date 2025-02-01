import express from "express";
import service from "./service.js";

const router = express.Router();

router.post("/", service.uploadProduct);

export default router;
