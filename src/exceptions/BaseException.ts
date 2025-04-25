// exceptions/BaseException.ts
export interface IBaseException {
  status: number;
  errorMessage: string | Record<string, string[]>;
  success: boolean;
}

export class BaseException extends Error implements IBaseException {
  public readonly status: number;
  public readonly errorMessage: string | Record<string, string[]>;
  public readonly success: boolean;

  constructor(
    status: number,
    errorMessage: string | Record<string, string[]>,
    success: boolean = false
  ) {
    // Error의 message는 string이어야 하므로, errorMessage를 string으로 변환
    super(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
    this.name = this.constructor.name;
    this.status = status;
    this.errorMessage = errorMessage;
    this.success = success;
  }
}