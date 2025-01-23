import express from "express";
import userRouter from "./Users/controller.js";
import productRouter from "./Products/controller.js";
import articleRouter from "./Articles/controller.js";
import likesRouter from "./Likes/controller.js";
import commentRouter from "./Comments/controller.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/articles", articleRouter);
router.use("/comments", commentRouter);
router.use("/likes", likesRouter);

export default router;
