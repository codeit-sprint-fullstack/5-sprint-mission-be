import { body, query } from "express-validator";

// 검증 규칙 정의
export const commentBaseValidationRules = [
  body("content")
    .isString()
    .isLength({ min: 1 })
    .withMessage("댓글은 1자 이상이어야 합니다."),
];
