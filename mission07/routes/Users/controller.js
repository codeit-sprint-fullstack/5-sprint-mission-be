import express from "express";
import {
  getInfo,
  login,
  logout,
  createUser,
  updateUser,
  deleteUser,
} from "./service.js";
import { verifyToken } from "../../middleware/index.js";

const router = express.Router();

router.get("/info", verifyToken, getInfo);
router.get("/logout", logout);
router.post("/signup", createUser);
router.post("/login", login);
router.patch("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
