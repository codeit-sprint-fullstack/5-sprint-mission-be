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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * ID로 유저 찾기
 * @param {string} id - 유저 ID
 * @returns {Object} - 유저 정보
 */
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.findUnique({
        where: {
            id: id,
            deletedAt: null, // 삭제되지 않은 유저만 조회
        },
    });
});
/**
 * 이메일로 유저 찾기
 * @param {string} email - 이메일
 * @returns {Object} - 유저 정보
 */
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prismaClient_1.default.user.findFirst({
            where: {
                email: email,
                deletedAt: null,
            },
        });
    }
    catch (error) {
        console.error("Error in findByEmail:", error);
        throw error;
    }
});
/**
 * 유저 데이터 저장
 * @param {Object} userData - 저장할 유저 데이터
 * @returns {Object} - 저장된 유저 정보
 */
const save = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.create({
        data: userData,
    });
});
/**
 * 민감한 유저 데이터 필터링
 * @param {Object} user - 필터링할 유저 데이터
 * @returns {Object} - 필터링된 유저 정보
 */
const filterSensitiveUserData = (user) => {
    const { password } = user, filteredUser = __rest(user, ["password"]);
    return filteredUser;
};
/**
 * 비밀번호 검증
 * @param {string} password - 검증할 비밀번호
 * @param {string} hashedPassword - 해싱된 비밀번호
 * @returns {boolean} - 검증 결과
 */
const verifyPassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = yield bcrypt_1.default.compare(password, hashedPassword);
    if (!isValid) {
        const error = new Error("비밀번호가 일치하지 않습니다.");
        error.name = "UnauthorizedError";
        throw error;
    }
    return true;
});
/**
 * 비밀번호 해싱
 * @param {string} password - 원본 비밀번호
 * @returns {string} - 해싱된 비밀번호
 */
const hashingPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return yield bcrypt_1.default.hash(password, saltRounds);
});
/**
 * 인증되지 않은 경우 401 에러 발생시킴
 * @returns {Error} - 401 에러
 */
const throwUnauthorizedError = () => {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
};
const userUtils = {
    findByEmail,
    findById,
    hashingPassword,
    verifyPassword,
    save,
    filterSensitiveUserData,
    throwUnauthorizedError,
};
exports.default = userUtils;
//# sourceMappingURL=userUtils.js.map