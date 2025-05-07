import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err.status) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "잘못된 입력값입니다.",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "요청한 리소스를 찾을 수 없습니다.",
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: "잘못된 요청입니다.",
    });
    return;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "입력값이 유효하지 않습니다.",
    });
    return;
  }

  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      message: "인증되지 않은 요청입니다.",
    });
    return;
  }

  if (err.name === "ForbiddenError") {
    res.status(403).json({
      success: false,
      message: "권한이 없습니다.",
    });
    return;
  }

  if (err.name === "NotFoundError") {
    res.status(404).json({
      success: false,
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
  return;
};

export default errorHandler;
