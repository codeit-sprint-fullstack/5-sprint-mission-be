import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../../utils/prismaClient";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../../middleware/auth.middleware";

// 비밀번호 해싱 함수
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// 회원가입 서비스
export const createUser = async (
  email: string,
  password: string,
  nickname?: string,
  image?: string
) => {
  // 이메일 중복 확인
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }
  if (nickname) {
    const existingUserByNickname = await prisma.users.findUnique({
      where: { nickname },
    });

    if (existingUserByNickname) {
      throw new Error("Nickname already exists");
    }
  }
  // 비밀번호 해싱
  const hashedPassword = await hashPassword(password);

  // 사용자 생성
  const newUser = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      nickname: nickname || "",
      image: image || "",
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
    },
  });

  return newUser;
};

// 로그인 서비스
export const authenticateUser = async (email: string, password: string) => {
  // 사용자 조회
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 비밀번호 검증
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  // 토큰 생성을 위한 페이로드 정의
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
  };

  // 액세스 토큰 및 리프레시 토큰 생성
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // 리프레시 토큰 만료 날짜 계산 (7일 후)
  const expiredAt = new Date();
  expiredAt.setDate(expiredAt.getDate() + 7);

  // Auths 모델에 리프레시 토큰 저장
  await prisma.auths.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      refreshToken,
      expiredAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    },
  };
};

// 로그아웃 서비스
export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) {
    return;
  }

  try {
    // 리프레시 토큰 검증 시도
    const decoded = verifyRefreshToken(refreshToken);

    // Auths 테이블에서 리프레시 토큰 삭제
    await prisma.auths.deleteMany({
      where: { refreshToken },
    });

    return { success: true };
  } catch (error) {
    // 토큰이 이미 유효하지 않은 경우에도 성공으로 간주
    return { success: true };
  }
};

// 토큰 갱신 서비스
export const refreshToken = async (refreshTokenStr: string) => {
  try {
    // 리프레시 토큰 검증
    const decoded = verifyRefreshToken(refreshTokenStr);

    // 1. Auths 테이블에서 리프레시 토큰 조회
    const storedToken = await prisma.auths.findFirst({
      where: {
        refreshToken: refreshTokenStr,
        expiredAt: { gt: new Date() }, // 만료되지 않은 토큰만 조회
      },
    });

    if (!storedToken) {
      throw new Error("Invalid or expired refresh token");
    }

    // 2. 별도 쿼리로 사용자 정보 조회
    const user = await prisma.users.findUnique({
      where: { id: storedToken.userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 새 액세스 토큰 생성
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const newAccessToken = generateAccessToken(tokenPayload);

    // 선택적으로 새 리프레시 토큰 생성 (토큰 교체 전략)
    // 리프레시 토큰 만료가 가까워지면 새 토큰 발급
    const now = new Date();
    const tokenExpiry = new Date(storedToken.expiredAt);
    const daysToExpiry =
      (tokenExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    // 만료 3일 이내면 새 리프레시 토큰 발급
    if (daysToExpiry < 3) {
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // 만료일 계산 (7일)
      const expiredAt = new Date();
      expiredAt.setDate(expiredAt.getDate() + 7);

      // 기존 토큰 삭제 및 새 토큰 저장
      await prisma.auths.delete({
        where: { id: storedToken.id },
      });

      await prisma.auths.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          refreshToken: newRefreshToken,
          expiredAt,
        },
      });

      return { accessToken: newAccessToken, newRefreshToken };
    }

    // 리프레시 토큰 교체가 필요 없는 경우
    return { accessToken: newAccessToken };
  } catch (error) {
    // JWT 검증 실패 또는 DB 조회 실패
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Invalid refresh token");
  }
};
