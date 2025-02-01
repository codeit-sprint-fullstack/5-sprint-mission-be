import express from "express";
import item from "./item/controller.js";
import register from "./register/controller.js";

const router = express.Router();

router.use("/item", item);
router.use("/register", register);

export default router;
