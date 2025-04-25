import { ZodError } from "zod";
import { BaseException } from "@/exceptions/BaseException";

export class ValidationException extends BaseException {
  constructor(error: ZodError) {
    const errors: Record<string, string[]> = {};

    for (const issue of error.issues) {
      // issue.path[0]가 유효하지 않은 경우 기본 키 사용
      const field = issue.path[0] ? String(issue.path[0]) : "unknown";

      // 디버깅용 로그
      console.log("Zod issue:", { path: issue.path, field, message: issue.message });

      // errors[field] 초기화
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    }

    super(400, errors, false);
    this.name = "ValidationException";
  }
}