import { body, query } from 'express-validator';

// 검증 규칙 정의
export const productBaseValidationRules = [
  body('name')
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('제목은 1자 이상, 20자 이하여야 합니다.'),
  body('description')
    .isString()
    .isLength({ min: 10 })
    .withMessage('설명은 10자 이상이어야 합니다.'),
  body('price')
    .isNumeric()
    .withMessage('가격을 숫자여야 합니다.'),
  body('tags')
    .isArray().withMessage('tags는 배열이어야 합니다.')
    .custom((value) => value.every((tag: unknown) => typeof tag === 'string'))
    .withMessage('tags 배열의 모든 요소는 문자열이어야 합니다.'),
  body('images')
    .isArray().withMessage('images는 배열이어야 합니다.')
    .custom((value) => value.every((image: unknown) => typeof image === 'string'))
    .withMessage('images 배열의 모든 요소는 문자열이어야 합니다.'),
];

export const productPaginationRules = [
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