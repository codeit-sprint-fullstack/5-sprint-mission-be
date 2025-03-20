export interface UserResponse {
  id: string,
  email: string,
  image: string | null,
  nickname: string,
  createdAt: Date,
  updatedAt: Date
}