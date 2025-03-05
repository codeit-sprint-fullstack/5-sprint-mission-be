"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const superstruct_1 = require("superstruct");
const client_1 = require("@prisma/client");
// 오류 처리 미들웨어
const errorHandler = (err, req, res, next) => {
    // Prisma 오류 처리
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Prisma의 구체적인 오류 코드를 체크할 수 있음
        if (err.code === "P2002") {
            return res.status(400).send({ message: "이미 존재하는 항목입니다." });
        }
        return res.status(400).send({ message: `Prisma 오류: ${err.message}` });
    }
    // StructError 처리
    if (err instanceof superstruct_1.StructError) {
        return res.status(400).send({ message: err.message });
    }
    // 기타 오류 처리
    res
        .status(500)
        .send({ message: "서버 오류가 발생했습니다.", error: err.message });
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
