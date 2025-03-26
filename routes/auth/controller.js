import express from "express";
import service from "./service.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.post("/signup", service.signup);
router.post("/signin", service.signin);
router.post("/signout", service.signout);
router.get("/me", auth.verifyToken, service.me);

export default router;
