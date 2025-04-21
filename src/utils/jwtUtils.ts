import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "panda-secret-key";

interface JwtPayload {
  userId: string;
}

// JWT 토큰 생성
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

// JWT 토큰 검증
const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
};
