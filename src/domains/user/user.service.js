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
exports.getUserById = void 0;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
/**
 * 사용자 ID로 사용자 정보 조회
 * @param userId 사용자 ID
 * @returns 사용자 정보 (nickname 포함)
 */
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.default.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nickname: true,
            },
        });
        return user;
    }
    catch (error) {
        console.error("❌ 사용자 조회 중 오류 발생:", error);
        throw new Error("사용자 조회 실패");
    }
});
exports.getUserById = getUserById;
