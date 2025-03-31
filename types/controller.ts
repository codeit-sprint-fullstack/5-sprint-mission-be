import { NextFunction, Request, Response } from "express";

export type ControllerHandler<T = void> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T> | void;