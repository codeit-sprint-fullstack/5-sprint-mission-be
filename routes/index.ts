import express from "express";
import productRouter from "./product/controller.ts";
import articleRouter from "./article/controller.ts";
import commentRouter from "./comment/controller.ts";
import authRouter from "./auth/controller.ts";
import imageRouter from "./image/controller.ts";
import userRouter from "./user/controller.ts";

const router = express.Router();

router.use("/products", productRouter);
router.use("/articles", articleRouter);
router.use("/comments", commentRouter);
router.use("/auth", authRouter);
router.use("/images", imageRouter);
router.use("/users", userRouter);

export default router;
