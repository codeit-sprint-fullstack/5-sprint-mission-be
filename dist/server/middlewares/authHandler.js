"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.validateUser = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization || "";
        if (authHeader.startsWith("Bearer google ")) {
            const token = authHeader.split(" ")[2];
            try {
                const ticket = yield client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload || !payload.email || !payload.name) {
                    return next({
                        status: 401,
                        message: "구글 사용자 정보가 부족합니다.",
                    });
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
                req.user = user;
                return next();
            }
            catch (error) {
                console.error("[❌ Google 토큰 검증 실패]", error);
                return next({ status: 401, message: "구글 토큰 검증 실패" });
            }
        }
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        if (!token) {
            console.warn("[⚠️ 인증 실패] 토큰 없음");
            return next({ status: 401, message: "인증이 필요합니다." });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!refreshToken) {
                    return next({ status: 401, message: "리프레시 토큰이 없습니다." });
                }
                try {
                    const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                    const expiresIn = (process.env.JWT_EXPIRES_IN ||
                        "1h");
                    const secret = process.env.JWT_SECRET;
                    if (!secret)
                        throw new Error("JWT_SECRET is not defined");
                    const options = { expiresIn };
                    const newAccessToken = jsonwebtoken_1.default.sign({ id: decodedRefreshToken.id }, secret, options);
                    req.headers.authorization = `Bearer ${newAccessToken}`;
                    const newDecoded = jsonwebtoken_1.default.verify(newAccessToken, secret);
                    const user = yield prismaClient_1.default.user.findUnique({
                        where: { id: newDecoded.id },
                    });
                    if (!user) {
                        console.warn("[❌ 유효하지 않은 사용자 ID]", newDecoded.id);
                        return next({
                            status: 401,
                            message: "유효하지 않은 사용자입니다.",
                        });
                    }
                    req.user = user;
                    return next();
                }
                catch (error) {
                    return next({
                        status: 401,
                        message: "리프레시 토큰이 유효하지 않거나 만료되었습니다.",
                    });
                }
            }
            console.error("[❌ 토큰 검증 실패]", err);
            return next({
                status: 401,
                message: "토큰이 유효하지 않거나 만료되었습니다.",
            });
        }
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            console.warn("[❌ 유효하지 않은 사용자 ID]", decoded.id);
            return next({ status: 401, message: "유효하지 않은 사용자입니다." });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("[❌ 인증 미들웨어 에러]", error);
        next(error);
    }
});
exports.validateUser = validateUser;
