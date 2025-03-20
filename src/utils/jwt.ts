import jwt from "jsonwebtoken";
import type { JwtPayload, Secret } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY || "your-secret-key";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "refresh-secret-key";

const generateAccessToken = (payload: string | Buffer | object, expiresIn: "1h" | "2h" | "30m" = "30m"): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Refresh Token 생성 (7일 유효)
const generateRefreshToken = (payload: string | object | Buffer): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

// JWT 토큰 검증
const verifyAccessToken = (token: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload | string;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

// Refresh Token 검증
const verifyRefreshToken = (token: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload | string;
  } catch (error) {
    return null;
  }
};

const getExpireAt = (token: string): Date | null => {
  const decoded = jwt.decode(token) as JwtPayload | null;

  if (!decoded || typeof decoded !== 'object' || !decoded.exp) {
    return null; // 만료일이 없거나 잘못된 토큰인 경우 null 반환
  }

  return new Date(decoded.exp * 1000);
}

const jwtUtil = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getExpireAt
}

export default jwtUtil;