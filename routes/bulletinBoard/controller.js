import express from "express";
import service from "./service.js";

const router = express.Router();
// 게시글 쓰기
router.post("/", service.uploadBulletinBoard);

export default router;
