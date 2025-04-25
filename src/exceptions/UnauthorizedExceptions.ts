import { BaseException } from "./BaseException";

export class UnauthorizedException extends BaseException {
  constructor(errorMessage: string = '로그인을 먼저 해야합니다.') {
    super(401, errorMessage, false);
  }
}