import { Request, Response, NextFunction } from "express";
import { BaseResponse } from "@/types/response";
import { BaseException } from "@/exceptions/BaseException";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;
  let message: string | Record<string, string[]> = "서버 오류가 발생하였습니다.";
  const success = false;

  if (error instanceof BaseException) {
    status = error.status;
    message = error.errorMessage; // errorMessage 사용
  } else {
    console.error(error.message);
  }

  const result: BaseResponse = {
    success,
    statusCode: status,
    message,
    timestamp: new Date().toISOString(),
  };

  console.log(result)

  res.status(status).json(result);
}