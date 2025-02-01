import express from "express";
import service from "./service.js";

const router = express.Router();
// 댓글
router.post("/", service.uploadComment);

export default router;
