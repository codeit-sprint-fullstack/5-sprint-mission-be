import express from "express";
import testRouter from "./routingTest/controller.js";
import productRouter from "./product/controller.js";

const router = express.Router();

router.use("/test", testRouter);
router.use("/products", productRouter);

export default router;