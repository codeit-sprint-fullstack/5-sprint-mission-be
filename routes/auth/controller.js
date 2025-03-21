import express from "express";
import service from "./service.js";

const router = express.Router();

router.post("/signup", service.signup);
router.post("/signin", service.signin);

export default router;
