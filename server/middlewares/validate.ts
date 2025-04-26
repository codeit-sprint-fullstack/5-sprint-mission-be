import { Request, Response, NextFunction, RequestHandler } from "express";
import multer from "multer";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (
    schema: ZodSchema,
    target: "body" | "params" | "query" = "body"
  ): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[target]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "유효성 검사 실패",
          errors: err.flatten().fieldErrors,
        });
        return;
      }
      next(err);
    }
  };

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const checkUUIDParams = (...keys: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const key of keys) {
      const value = req.params[key];
      if (value && !uuidRegex.test(value)) {
        res.status(400).json({ message: `Invalid ${key}` });
        return;
      }
    }
    next();
  };
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(null, false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
  },
});
