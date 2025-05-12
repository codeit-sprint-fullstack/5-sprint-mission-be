import { ValidationException } from "@/exceptions/ValidationException";
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

type SchemaSet = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export const validate =
  (schemas: SchemaSet) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Body 검증
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          throw new ValidationException(result.error);
        }
      }

      // Query 검증
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          throw new ValidationException(result.error);
        }
      }

      // Params 검증
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          throw new ValidationException(result.error);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
