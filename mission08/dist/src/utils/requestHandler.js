"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// requestHandler 고차 함수
const requestHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next); // 실제 핸들러 함수 실행
        }
        catch (error) {
            next(error); // 에러 발생 시 next로 에러 전달
        }
    };
};
exports.default = requestHandler;
