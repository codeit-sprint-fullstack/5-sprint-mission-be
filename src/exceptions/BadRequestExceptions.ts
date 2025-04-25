import { BaseException } from "./BaseException";

export class BadRequestException extends BaseException {
  constructor(errorMessage: string) {
    super(400, errorMessage, false);
  }
}