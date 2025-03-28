import express, { NextFunction, Request, Response } from "express";
import auth from "../../middleware/auth.ts";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import CustomError from "../../types/error.ts";
import service from "./service.ts";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../public/uploads");

const upload = multer({ dest: uploadDir });

router.post(
  "/upload",
  upload.single("image"),
  auth.verifyAccessToken,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file)
      return next(new CustomError(400, "업로드 된 파일이 없습니다."));
    const result = await service.uploadImage(req.file);
    res.status(200).json(result);
  }
);

export default router;
