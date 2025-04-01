import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

// JWT 관련 상수 및 설정
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET;

// 페이로드 타입 정의
export interface TokenPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

// 인증된 요청 타입 정의
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * 액세스 토큰을 생성하는 함수
 * @param payload 토큰에 포함할 데이터
 * @param expiresIn 토큰 만료 시간 (기본값: 1일)
 * @returns 생성된 JWT 토큰 문자열
 */
export const generateAccessToken = (
  payload: TokenPayload,
  expiresIn = "1d"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * 리프레시 토큰을 생성하는 함수
 * @param payload 토큰에 포함할 데이터
 * @param expiresIn 토큰 만료 시간 (기본값: 7일)
 * @returns 생성된 리프레시 토큰 문자열
 */
export const generateRefreshToken = (
  payload: TokenPayload,
  expiresIn = "7d"
): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
};

/**
 * 액세스 토큰 검증
 * @param token 검증할 액세스 토큰
 * @returns 검증된 토큰의 payload
 * @throws Error 토큰이 유효하지 않을 경우
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

/**
 * 리프레시 토큰 검증
 * @param token 검증할 리프레시 토큰
 * @returns 검증된 토큰의 payload
 * @throws Error 토큰이 유효하지 않을 경우
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

/**
 * JWT 토큰에서 payload 추출
 * @param token JWT 토큰
 * @returns 디코딩된 payload
 */
export const decodeToken = (token: string): TokenPayload | null => {
  return jwt.decode(token) as TokenPayload | null;
};

/**
 * JWT 인증 미들웨어
 * Authorization 헤더에서 토큰을 추출하고 검증하여 req.user에 디코딩된 정보 설정
 */
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "인증 토큰이 필요합니다." });
      return;
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN 형식에서 TOKEN 부분만 추출

    try {
      // 토큰 검증에 verifyAccessToken 함수 사용
      const decoded = verifyAccessToken(token);

      // req.user에 디코딩된 정보 설정
      (req as AuthenticatedRequest).user = decoded;

      // 디버깅용 로그
      console.log("🔑 인증된 사용자 정보:", decoded);

      next();
    } catch (err) {
      console.error("❌ 토큰 검증 실패:", err);
      res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
  } catch (err) {
    console.error("❌ 인증 처리 중 오류:", err);
    res.status(500).json({ message: "인증 처리 중 오류가 발생했습니다." });
  }
};
