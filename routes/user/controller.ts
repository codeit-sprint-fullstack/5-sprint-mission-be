import express from "express";
import auth from "../../middleware/auth.ts";
import service from "./service.ts";

const router = express.Router();

router.get("/me", auth.verifyAccessToken, service.getUser);

export default router;