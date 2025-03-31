import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import CustomError from "../types/error.ts";

const errorHandler: ErrorRequestHandler = (
  err: CustomError & { status?: number; name?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500;

  // ✅ express-jwt에서 발생하는 에러 처리
  if (err.name === "UnauthorizedError") {
    if (err.message === "No authorization token was found") {
      res.status(401).json({
        success: false,
        message: "토큰이 없습니다. 로그인 후 이용해주세요.",
      });
      return;
    }
    if (err.message === "jwt expired") {
      res.status(401).json({
        success: false,
        message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
    return;
  }

  if(statusCode === 500)console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || "서버 내부 오류 발생",
  });
};

export default errorHandler;
