/**
 * 에러 핸들러
 * @param {Error} error - 에러 객체
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  code?: number;
  data?: any;
}

const errorHandler: ErrorRequestHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 기본 상태 코드는 500(서버 오류)로 설정
  let status = 500;
  let message = "Internal Server Error";

  // 에러 타입에 따라 적절한 상태 코드와 메시지 설정
  if (error.code) {
    status = error.code;
  } else if (error.name === "ValidationError") {
    // 유효성 검증 오류 (예: Mongoose, Joi 등)
    status = 400;
    message = error.message || "입력값이 유효하지 않습니다";
  } else if (error.name === "CastError") {
    // 데이터 형식 변환 오류 (예: MongoDB ID 형식 오류)
    status = 400;
    message = "잘못된 데이터 형식입니다";
  } else if (error.name === "SyntaxError") {
    // JSON 파싱 오류 등
    status = 400;
    message = "잘못된 요청 구문입니다";
  } else if (error.name === "UnauthorizedError") {
    // 인증 관련 오류
    status = 401;
    message = "인증이 필요합니다";
  } else if (error.name === "ForbiddenError") {
    // 권한 관련 오류
    status = 403;
    message = "접근 권한이 없습니다";
  } else if (error.name === "NotFoundError") {
    // 리소스를 찾을 수 없음
    status = 404;
    message = "요청한 리소스를 찾을 수 없습니다";
  }

  res.status(status).json({
    status,
    path: req.path,
    method: req.method,
    message: error.message || message,
    data: error.data || undefined,
  });
};

export default errorHandler;
