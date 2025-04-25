import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config(process.env.CLOUDINARY_URL!);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "panda_market_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  }),
});

const upload = multer({ storage });

export { upload };
