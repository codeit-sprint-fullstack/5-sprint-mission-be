import userController from "@/controllers/userController";
import { Router } from "express";

const router = Router();

router.get("/me", userController.getUserInfo);

export default router;
