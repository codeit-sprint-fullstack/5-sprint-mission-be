import express, { Router } from "express";
import service from "./service";
import auth from "../../middlewares/auth";

const router: Router = express.Router();

router.post("/signup", service.signup);
router.post("/signin", service.signin);
router.post("/signout", service.signout);
router.get("/me", auth.verifyToken, service.me);

export default router;
