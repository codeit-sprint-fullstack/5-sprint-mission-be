import { BaseException } from "./BaseException";

export class ForbiddenException extends BaseException {
  constructor(errorMessage: string = '접근 권한이 없습니다.') {
    super(400, errorMessage, false);
  }
}