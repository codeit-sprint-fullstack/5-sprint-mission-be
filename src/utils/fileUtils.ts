import fs from "fs";
import path from "path";

/**
 * 파일 목록을 삭제
 * @param filePaths 삭제할 파일 경로 배열
 */
export const deleteFiles = (filePaths: string[]): void => {
  if (filePaths.length === 0) return;

  console.log(`🗑️ ${filePaths.length}개 파일 삭제 시작`);
  filePaths.forEach((filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ 파일 삭제 성공: ${filePath}`);
      }
    } catch (e) {
      console.error(`❌ 파일 삭제 실패: ${filePath}`, e);
    }
  });
};

/**
 * 상대 경로를 절대 경로로 변환
 * @param relativePath 상대 경로
 * @returns 프로젝트 루트 기준 절대 경로
 */
export const getFullImagePath = (relativePath: string): string => {
  return path.join(process.cwd(), "public", relativePath.replace(/^\//, ""));
};
