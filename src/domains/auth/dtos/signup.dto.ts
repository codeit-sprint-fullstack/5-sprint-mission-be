import { UserResponse } from "../../user/dtos/user.dto"

export interface SignUpRequest {
  email: string,
  nickname: string,
  password: string,
  passwordConfirmation: string
}

export interface SignUpResponse {
  accessToken: string,
  refreshToken: string,
  user: UserResponse
}