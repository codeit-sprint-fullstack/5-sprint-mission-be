import { body, query } from 'express-validator';

// 검증 규칙 정의
export const articleBaseValidationRules = [
  body('title')
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('제목은 1자 이상, 20자 이하여야 합니다.'),
  body('content')
    .isString()
    .isLength({ min: 10 })
    .withMessage('설명은 10자 이상이어야 합니다.'),
  body('image')
    .isString()
    .withMessage('이미지는 문자열이어야 합니다.'),
];

export const articlePaginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page는 1 이상의 정수여야 합니다.'),
  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('pageSize는 1 이상 10 이하여야 합니다.'),
  query('orderBy')
    .optional()
    .isIn(['createdAt', 'favorite'])
    .withMessage('orderBy는 createdAt 또는 favorite 이어야 합니다.'),
  query('keyword')
    .optional()
    .isString()
    .withMessage('keyword는 문자열이어야 합니다.'),
];