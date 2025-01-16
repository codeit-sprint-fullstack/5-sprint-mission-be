import express from "express";
import itemsRouter from "./items/controller.js";
import registrationRouter from "./registration/controller.js";

const router = express.Router();

router.use("/items", itemsRouter);
router.use("/registration", registrationRouter);

export default router;
