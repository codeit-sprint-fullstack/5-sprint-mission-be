import { upload } from "@/config/cloudinary";
import imageController from "@/controllers/imageController";
import { Router } from "express";

const router = Router();

router.post("/upload", upload.single("image"), imageController.uploadImage);

export default router;
