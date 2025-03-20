import { UserResponse } from "../../user/dtos/user.dto";

export interface AuthResponse {
  accessToken: string,
  refreshToken: string,
  user: UserResponse
}