import { Request, Response, NextFunction, RequestHandler } from "express";

// requestHandler 고차 함수
const requestHandler = (handler: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next); // 실제 핸들러 함수 실행
    } catch (error) {
      next(error); // 에러 발생 시 next로 에러 전달
    }
  };
};

export default requestHandler;
