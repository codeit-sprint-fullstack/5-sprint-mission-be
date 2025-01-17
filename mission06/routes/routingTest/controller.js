import express from "express";
import service from "./service.js";

const router = express.Router();

router.get("/message", service.testMessage);
router.get("/dbtest", service.findDataByDatabase);

export default router;