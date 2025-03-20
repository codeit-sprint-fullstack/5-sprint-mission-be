
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from "express";
import jwtUtil from "../utils/jwt";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwtUtil.verifyAccessToken(token);

  if (!decoded) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  (req as any).user = decoded; // 인증된 사용자 정보 저장
  next();
};

/**
 * 회원가입
 */
// 검증 규칙 정의
export const signUpValidationRules = [
  body('email')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  body('nickname')
    .isLength({ min: 1, max: 20 })
    .withMessage('닉네임은 1자 이상, 20자 이하여야 합니다.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^([a-z]|[A-Z]|[0-9]|[!@#$%^&*])+$/)
    .withMessage('비밀번호는 영문자, 숫자 및 특수문자 (!@#$%^&*) 만 사용할 수 있습니다.'),
  body('passwordConfirmation')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }
      return true;
    })
];

/**
 * 로그인
 */
// 검증 규칙 정의
export const signInValidationRules = [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^([a-z]|[A-Z]|[0-9]|[!@#$%^&*])+$/)
    .withMessage('비밀번호는 영문자, 숫자 및 특수문자 (!@#$%^&*) 만 사용할 수 있습니다.'),
];

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