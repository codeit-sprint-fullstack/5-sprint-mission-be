import { Request } from "express";
import UserCard from "./user.ts";

export default interface AuthRequest extends Request<{ id: string }> {
  user?: UserCard; // 🔹 user 객체에 id 속성이 있는 것으로 정의
}