import express from "express";
import itemsRouter from "./items/controller.js";
import registrationRouter from "./registration/controller.js";
import boardRouter from "./board/controller.js";

const router = express.Router();

router.use("/items", itemsRouter);
router.use("/registration", registrationRouter);
router.use("/board", boardRouter);

export default router;
