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
exports.logout = exports.refreshToken = exports.login = exports.signUp = exports.googleLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateAccessToken = (user) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
        "1h");
    if (!secret) {
        throw {
            status: 500,
            message: "JWT_SECRET 설정이 누락되었습니다.",
        };
    }
    return jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn });
};
const generateRefreshToken = (user) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ||
        "30d");
    if (!secret) {
        throw {
            status: 500,
            message: "JWT_REFRESH_SECRET 설정이 누락되었습니다.",
        };
    }
    return jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn });
};
const googleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code) {
        return next({ status: 400, message: "Authorization code가 필요합니다." });
    }
    try {
        const tokenResponse = yield fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID || "",
                client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
                redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
                grant_type: "authorization_code",
            }),
        });
        if (!tokenResponse.ok) {
            const errorData = yield tokenResponse.json();
            console.error("구글 토큰 교환 실패:", errorData);
            return next({ status: 400, message: "구글 토큰 교환 실패" });
        }
        const tokenData = yield tokenResponse.json();
        const { id_token } = tokenData;
        if (!id_token) {
            return next({ status: 400, message: "id_token이 없습니다." });
        }
        const ticket = yield client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            return next({ status: 400, message: "구글 사용자 정보가 부족합니다." });
        }
        let user = yield prismaClient_1.default.user.findUnique({
            where: { email: payload.email },
        });
        if (!user) {
            user = yield prismaClient_1.default.user.create({
                data: {
                    email: payload.email,
                    nickname: payload.name,
                    image: payload.picture,
                    encryptedPassword: "google-oauth",
                },
            });
        }
        const accessTokenJWT = generateAccessToken(user);
        const refreshTokenJWT = generateRefreshToken(user);
        res.cookie("accessToken", accessTokenJWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshTokenJWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json({
            accessToken: accessTokenJWT,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                image: user.image,
            },
        });
    }
    catch (error) {
        console.error("구글 로그인 에러:", error);
        next(error);
    }
});
exports.googleLogin = googleLogin;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, nickname, password } = req.body;
        const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return next({ status: 409, message: "이미 사용 중인 이메일입니다." });
        }
        const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield prismaClient_1.default.user.create({
            data: { email, nickname, encryptedPassword },
        });
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            accessToken,
            user: {
                id: newUser.id,
                email: newUser.email,
                nickname: newUser.nickname,
                image: newUser.image,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return next({ status: 401, message: "존재하지 않는 사용자입니다." });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.encryptedPassword);
        if (!isPasswordValid) {
            return next({ status: 401, message: "비밀번호가 잘못되었습니다." });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                image: user.image,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return next({ status: 401, message: "리프레시 토큰이 존재하지 않습니다." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = yield prismaClient_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return next({ status: 401, message: "유효하지 않은 사용자입니다." });
        }
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        return next({
            status: 401,
            message: "리프레시 토큰이 유효하지 않거나 만료되었습니다.",
        });
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res.status(200).json({ message: "로그아웃 성공" });
});
exports.logout = logout;
