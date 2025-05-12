"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userUtils_1 = __importDefault(require("../utils/userUtils"));
const jwtUtils_1 = __importDefault(require("../utils/jwtUtils"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 쿠키에서 토큰 가져오기
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                status: 401,
                path: req.path,
                method: req.method,
                message: "로그인 후 이용해주세요.",
            });
            return;
        }
        // 토큰 검증
        const decoded = jwtUtils_1.default.verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                status: 401,
                path: req.path,
                method: req.method,
                message: "유효하지 않은 토큰입니다.",
            });
            return;
        }
        const user = yield userUtils_1.default.findById(decoded.userId);
        // 유저id가 데이터베이스에 존재하지 않으면 인증 실패
        if (!user) {
            res.status(401).json({
                status: 401,
                path: req.path,
                method: req.method,
                message: "로그인 후 이용해주세요.",
            });
            return;
        }
        // 이후 편리성을 위한 유저 정보 전달
        req.user = {
            id: decoded.userId,
            email: user.email,
            nickname: user.nickname,
        };
        // 사용자가 로그인되어 있다면 다음 미들웨어 처리
        next();
    }
    catch (error) {
        next(error); // 에러 핸들러로 전달
    }
});
const optionalVerifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        // 토큰이 없는 경우 그냥 다음 미들웨어로 진행
        if (!token) {
            return next();
        }
        // 토큰이 있는 경우 검증
        const decoded = jwtUtils_1.default.verifyToken(token);
        if (!decoded) {
            return next();
        }
        const user = yield userUtils_1.default.findById(decoded.userId);
        if (!user) {
            return next();
        }
        // 유저 정보 설정
        req.user = {
            id: decoded.userId,
            email: user.email,
            nickname: user.nickname,
        };
        next();
    }
    catch (error) {
        // 토큰 검증 실패시에도 다음 미들웨어로 진행
        next();
    }
});
exports.default = {
    verifyToken,
    optionalVerifyToken,
};
//# sourceMappingURL=auth.js.map