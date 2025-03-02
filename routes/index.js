import express from "express";
import productRouter from "./product/controller.js";
import articleRouter from "./article/controller.js";
import commentRouter from "./comment/controller.js";
import authRouter from "./auth/router.js";

const router = express.Router();

router.use("/product", productRouter);
router.use("/article",articleRouter);
router.use("/comment",commentRouter);
router.use("/auth",authRouter);



export default router;