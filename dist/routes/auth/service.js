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
const userUtils_1 = __importDefault(require("../../utils/userUtils"));
const jwtUtils_1 = __importDefault(require("../../utils/jwtUtils"));
// 회원가입
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, nickname } = req.body;
        // 이메일 중복 여부 확인
        const existedUser = yield userUtils_1.default.findByEmail(email);
        if (existedUser) {
            const error = new Error("이미 가입된 이메일입니다.");
            error.code = 422;
            throw error;
        }
        // 비밀번호 해싱
        const hashedPassword = yield userUtils_1.default.hashingPassword(password);
        // 입력받은 데이터로 데이터베이스에 저장
        const createdUser = yield userUtils_1.default.save({
            email,
            password: hashedPassword,
            nickname,
        });
        // 저장된 데이터에서 비밀번호 필터링하여 response로 전달
        const filteredUserData = userUtils_1.default.filterSensitiveUserData(createdUser);
        // JWT 토큰 생성
        const token = jwtUtils_1.default.generateToken(filteredUserData.id);
        // 쿠키에 토큰 저장
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1일
        });
        res.status(201).json(filteredUserData);
    }
    catch (error) {
        next(error);
    }
});
// 로그인
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 입력받은 데이터로 데이터베이스에서 조회
        const getUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
            // 이메일로 유저 데이터 조회
            const user = yield userUtils_1.default.findByEmail(email);
            if (!user) {
                const error = new Error("존재하지 않는 이메일입니다.");
                error.code = 401;
                throw error;
            }
            // 등록된 이메일인 경우 비밀번호 검증
            yield userUtils_1.default.verifyPassword(password, user.password);
            // 비밀번호 검증 통과 후 필터링된 유저 정보 반환
            return userUtils_1.default.filterSensitiveUserData(user);
        });
        const loginUser = yield getUser(email, password);
        // JWT 토큰 생성
        const token = jwtUtils_1.default.generateToken(loginUser.id);
        // 쿠키에 토큰 저장
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1일
        });
        res.status(200).json(loginUser);
    }
    catch (error) {
        next(error);
    }
});
// 로그아웃
const signout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 쿠키 삭제
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(200).json({ message: "로그아웃 되었습니다." });
    }
    catch (error) {
        next(error);
    }
});
// 현재 로그인된 사용자 정보 조회
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // auth 미들웨어에서 설정한 user 정보 반환
        res.status(200).json(req.user);
    }
    catch (error) {
        next(error);
    }
});
const service = {
    signup,
    signin,
    signout,
    me,
};
exports.default = service;
//# sourceMappingURL=service.js.map