import { Request, Response, NextFunction, RequestHandler } from "express";
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
