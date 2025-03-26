import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "panda-secret-key";

// JWT 토큰 생성
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};

// JWT 토큰 검증
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
};
