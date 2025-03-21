import { UserResponse } from "../../user/dtos/user.dto";

export interface AuthResponse {
  accessToken: string,
  refreshToken: string,
  user: UserResponse
}

export interface AuthInfo {
  userId: string,
  role: string
}