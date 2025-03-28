import jwt from "jsonwebtoken";
import User from "../types/user.ts";
export const createToken = (user: User, type?: string) => {
  const payload = { email: user.email, id: user.id, nickname: user.nickname };
  const options = { expiresIn: type === 'refresh' ? 1209600 : 3600 };
  const secret: string =
    process.env.JWT_SECRET ?? "COFB7pS8MNjTWC5yDNB5kGJVtTShK4XAuI04f09rJVE=";
  return jwt.sign(payload, secret, options);
};
