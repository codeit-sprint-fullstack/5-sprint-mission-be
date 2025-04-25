import { SuccessResponse } from "@/types/response";

export default function createSuccessResponse<T>(
  data: T,
  message: string,
  statusCode?: number
): SuccessResponse<T> {
  return {
    success: true,
    statusCode: statusCode ?? 200,
    message,
    data,
  };
}
