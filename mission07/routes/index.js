import express from "express";
import productRouter from "./product/controller.js";
import articleRouter from "./article/controller.js";
import commentRouter from "./comment/controller.js";

const router = express.Router();

router.use("/product", productRouter);
router.use("/article",articleRouter);
router.use("/comment",commentRouter);



export default router;