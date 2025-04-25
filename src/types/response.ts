// 기본 응답 인터페이스
export interface BaseResponse {
  success: boolean;
  statusCode: number;
  message?: string | Record<string, string[]>
  timestamp?: Date | string;
}

export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
}