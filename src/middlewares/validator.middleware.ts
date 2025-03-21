import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// 검증 결과 처리 미들웨어
export const validateReq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
      return;
    }
    next();
  } catch (error) {
    console.error('유효성 검사 오류:', error);
    res.status(500).send({ message: '유효성 검사 중 서버 오류 발생' });
    return;
  }
};