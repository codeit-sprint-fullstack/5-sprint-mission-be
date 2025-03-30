"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullImagePath = exports.deleteFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * 파일 목록을 삭제
 * @param filePaths 삭제할 파일 경로 배열
 */
const deleteFiles = (filePaths) => {
    if (filePaths.length === 0)
        return;
    console.log(`🗑️ ${filePaths.length}개 파일 삭제 시작`);
    filePaths.forEach((filePath) => {
        try {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                console.log(`✅ 파일 삭제 성공: ${filePath}`);
            }
        }
        catch (e) {
            console.error(`❌ 파일 삭제 실패: ${filePath}`, e);
        }
    });
};
exports.deleteFiles = deleteFiles;
/**
 * 상대 경로를 절대 경로로 변환
 * @param relativePath 상대 경로
 * @returns 프로젝트 루트 기준 절대 경로
 */
const getFullImagePath = (relativePath) => {
    return path_1.default.join(process.cwd(), "public", relativePath.replace(/^\//, ""));
};
exports.getFullImagePath = getFullImagePath;
