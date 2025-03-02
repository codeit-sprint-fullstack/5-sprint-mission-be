import express from "express";
import articleRouter from "./controllers/article";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from the Express Router!");
});

router.use("/article", articleRouter);

export default router;
