import express from "express";
import {
  login,
  logout,
  createUser,
  updateUser,
  deleteUser,
} from "./service.js";

const router = express.Router();

router.get("/login", login);
router.get("/logout", logout);
router.post("/signup", createUser);
router.patch("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
