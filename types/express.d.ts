import { JwtPayload } from "jsonwebtoken";

declare module "express" {
  interface Request {
    auth?: JwtPayload & { userId?: number }; // 🔥 auth가 존재할 수도 있고 없을 수도 있음
  }
}
