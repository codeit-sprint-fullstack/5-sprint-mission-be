import express from "express";
import product from "./product/controller.js";
import comment from "./comment/controller.js";
import bulletinBoard from "./bulletinBoard/controller.js";

const router = express.Router();

router.use("/product", product);
router.use("/comment", comment);
router.use("/bulletinBoard", bulletinBoard);

export default router;
