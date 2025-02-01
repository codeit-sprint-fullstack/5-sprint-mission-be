import express from "express";
import service from "./service.js";

const router = express.Router();

router.get("/", service.getProduct);

export default router;
