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
exports.refreshToken = exports.logoutUser = exports.authenticateUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
// 비밀번호 해싱 함수
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
});
// 회원가입 서비스
const createUser = (email, password, nickname, image) => __awaiter(void 0, void 0, void 0, function* () {
    // 이메일 중복 확인
    const existingUser = yield prismaClient_1.default.users.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    if (nickname) {
        const existingUserByNickname = yield prismaClient_1.default.users.findUnique({
            where: { nickname },
        });
        if (existingUserByNickname) {
            throw new Error("Nickname already exists");
        }
    }
    // 비밀번호 해싱
    const hashedPassword = yield hashPassword(password);
    // 사용자 생성
    const newUser = yield prismaClient_1.default.users.create({
        data: {
            email,
            password: hashedPassword,
            nickname: nickname || "",
            image: image || "",
        },
        select: {
            id: true,
            email: true,
            nickname: true,
            image: true,
            createdAt: true,
        },
    });
    return newUser;
});
exports.createUser = createUser;
// 로그인 서비스
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // 사용자 조회
    const user = yield prismaClient_1.default.users.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("User not found");
    }
    // 비밀번호 검증
    const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Invalid credentials");
    }
    // 토큰 생성을 위한 페이로드 정의
    const tokenPayload = {
        userId: user.id,
        email: user.email,
    };
    // 액세스 토큰 및 리프레시 토큰 생성
    const accessToken = (0, auth_middleware_1.generateAccessToken)(tokenPayload);
    const refreshToken = (0, auth_middleware_1.generateRefreshToken)(tokenPayload);
    // 리프레시 토큰 만료 날짜 계산 (7일 후)
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);
    // Auths 모델에 리프레시 토큰 저장
    yield prismaClient_1.default.auths.create({
        data: {
            id: crypto_1.default.randomUUID(),
            userId: user.id,
            refreshToken,
            expiredAt,
        },
    });
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        },
    };
});
exports.authenticateUser = authenticateUser;
// 로그아웃 서비스
const logoutUser = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        return;
    }
    try {
        // 리프레시 토큰 검증 시도
        const decoded = (0, auth_middleware_1.verifyRefreshToken)(refreshToken);
        // Auths 테이블에서 리프레시 토큰 삭제
        yield prismaClient_1.default.auths.deleteMany({
            where: { refreshToken },
        });
        return { success: true };
    }
    catch (error) {
        // 토큰이 이미 유효하지 않은 경우에도 성공으로 간주
        return { success: true };
    }
});
exports.logoutUser = logoutUser;
// 토큰 갱신 서비스
const refreshToken = (refreshTokenStr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 리프레시 토큰 검증
        const decoded = (0, auth_middleware_1.verifyRefreshToken)(refreshTokenStr);
        // 1. Auths 테이블에서 리프레시 토큰 조회
        const storedToken = yield prismaClient_1.default.auths.findFirst({
            where: {
                refreshToken: refreshTokenStr,
                expiredAt: { gt: new Date() }, // 만료되지 않은 토큰만 조회
            },
        });
        if (!storedToken) {
            throw new Error("Invalid or expired refresh token");
        }
        // 2. 별도 쿼리로 사용자 정보 조회
        const user = yield prismaClient_1.default.users.findUnique({
            where: { id: storedToken.userId },
            select: {
                id: true,
                email: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        // 새 액세스 토큰 생성
        const tokenPayload = {
            userId: user.id,
            email: user.email,
        };
        const newAccessToken = (0, auth_middleware_1.generateAccessToken)(tokenPayload);
        // 선택적으로 새 리프레시 토큰 생성 (토큰 교체 전략)
        // 리프레시 토큰 만료가 가까워지면 새 토큰 발급
        const now = new Date();
        const tokenExpiry = new Date(storedToken.expiredAt);
        const daysToExpiry = (tokenExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        // 만료 3일 이내면 새 리프레시 토큰 발급
        if (daysToExpiry < 3) {
            const newRefreshToken = (0, auth_middleware_1.generateRefreshToken)(tokenPayload);
            // 만료일 계산 (7일)
            const expiredAt = new Date();
            expiredAt.setDate(expiredAt.getDate() + 7);
            // 기존 토큰 삭제 및 새 토큰 저장
            yield prismaClient_1.default.auths.delete({
                where: { id: storedToken.id },
            });
            yield prismaClient_1.default.auths.create({
                data: {
                    id: crypto_1.default.randomUUID(),
                    userId: user.id,
                    refreshToken: newRefreshToken,
                    expiredAt,
                },
            });
            return { accessToken: newAccessToken, newRefreshToken };
        }
        // 리프레시 토큰 교체가 필요 없는 경우
        return { accessToken: newAccessToken };
    }
    catch (error) {
        // JWT 검증 실패 또는 DB 조회 실패
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Invalid refresh token");
    }
});
exports.refreshToken = refreshToken;
