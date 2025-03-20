import bcrypt from 'bcrypt';
import { Users } from '@prisma/client';
import jwtUtil from "../../../utils/jwt";
import prisma from "../../../utils/prismaClient";
import { CustomError } from '../../../utils/errorHandler';
import { SignUpRequest } from "../dtos/signup.dto";
import { SignInRequest } from '../dtos/signin.dto';
import { AuthResponse } from '../interfaces/auth.interface';

type SignUp = (data: SignUpRequest) => Promise<AuthResponse>
type SignIn = (data: SignInRequest) => Promise<AuthResponse>

// 회원가입
const signUp: SignUp = async (data) => {
  await checkDuplicateUserOrThrow(data);

  const user = await createUser(data);
  const { accessToken, refreshToken, expiresAt } = generateTokens(user.email);

  await storeAuthInfo(user.id, refreshToken, expiresAt);

  // password 필드 제거
  const { password: _ignored, ...userWithoutPassword } = user;

  return {
    accessToken, refreshToken, user: {
      ...userWithoutPassword,
      image: userWithoutPassword.image ?? ''
    }
  };
}

// 로그인
const signIn: SignIn = async (data) => {
  const { email, password } = data;
  const user = await getUserOrThrow(email);

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid)
    throw new CustomError('비밀번호가 일치하지 않습니다.', 401);

  const { accessToken, refreshToken, expiresAt } = generateTokens(email);
  await storeAuthInfo(user.id, refreshToken, expiresAt);

  const { password: _ignored, ...userWithoutPassword } = user;

  return {
    accessToken, refreshToken, user: {
      ...userWithoutPassword,
      image: userWithoutPassword.image ?? ''
    }
  };
}

// 리프레쉬 토큰으로 액세스 토큰 재발급
const refresh = async (refreshToken: string | null) => {
  if (!refreshToken) throw new CustomError("Refresh token required", 401);

  const decoded = jwtUtil.verifyRefreshToken(refreshToken);
  if (!decoded || typeof decoded === "string") throw new CustomError("Invalid refresh token", 403);

  const { email, role } = decoded;
  const newAccessToken = jwtUtil.generateAccessToken({ email, role });

  return newAccessToken;
}

// email, nickname 중복 확인 => 회원가입
const checkDuplicateUserOrThrow = async (data: SignUpRequest) => {
  const { email, nickname } = data;

  const duplicateUser: Users | null = await prisma.users.findFirst({
    where: {
      OR: [
        { email },
        { nickname }
      ]
    }
  });

  if (duplicateUser) {
    if (duplicateUser.email === email) {
      throw new CustomError("Email already exists", 400);
    }
    if (duplicateUser.nickname === nickname) {
      throw new CustomError("Nickname already exists", 400);
    }
  }
}

// 사용자 생성 함수 => 회원가입
const createUser = async ({ email, nickname, password }: { email: string, nickname: string, password: string }): Promise<Users> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.users.create({
    data: { email, nickname, password: hashedPassword }
  });
};

// 사용자 조회 => 로그인
const getUserOrThrow = async (email: string): Promise<Users> => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user)
    throw new CustomError('비밀번호가 일치하지 않습니다.', 400);
  return user;
}

// 토큰 생성 함수 => 회원가입, 로그인
const generateTokens = (email: string) => {
  const payload = { email, role: "admin" };
  const accessToken = jwtUtil.generateAccessToken(payload);
  const refreshToken = jwtUtil.generateRefreshToken(payload);
  const expiresAt = jwtUtil.getExpireAt(refreshToken);

  return { accessToken, refreshToken, expiresAt };
};

// 인증 정보 저장 함수 => 회원가입, 로그인
const storeAuthInfo = async (userId: string, refreshToken: string, expiresAt: Date | null) => {
  if (expiresAt) {
    await prisma.auths.upsert({
      where: { userId },
      update: { refreshToken, expiresAt },
      create: { userId, refreshToken, expiresAt },
    });
  }
};

const authService = {
  signUp,
  signIn,
  refresh
}

export default authService;