import { NextFunction, Request, Response } from "express";
import prisma from "../../prismaClient.js";
import { comparePassword, hashPassword } from "../../utils/hash.ts";
import { createToken } from "../../utils/token.ts";
import CustomError from "../../types/error.ts";

//로그인
const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return { status: 401, data: { message: "존재하지 않는 회원 ID입니다." } };
  }
  const { encryptedPassword, refreshToken : oldRefreshToken, ...userWithoutPassword } = user;
  const isVerify = await comparePassword(password, user.encryptedPassword);
  if (isVerify) {
    const accessToken = createToken(user);
    const refreshToken = createToken(user, "refresh");
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });
    return {
      status: 200,
      data: {
        message: "로그인 성공!",
        userWithoutPassword,
        accessToken,
        refreshToken,
      },
    };
  } else {
    return { status: 401, data: { message: "비밀번호가 틀렸습니다." } };
  }
};

//회원가입
const register = async (email: string, nickname: string, password: string) => {
  const secretPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email,
      nickname: nickname,
      encryptedPassword: secretPassword,
    },
  });

  const { encryptedPassword, refreshToken : oldRefreshToken, ...userWithoutPassword } = user;

  const accessToken = createToken(user);

  const refreshToken = createToken(user, "refresh");
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  return {
    status: 200,
    data: {
      message: "회원가입에 성공했습니다.",
      userWithoutPassword,
      accessToken,
      refreshToken,
    },
  };
};

const refreshToken = async (
  userId: number,
  refreshToken: string,
  next: NextFunction
): Promise<{ accessToken: string; newRefreshToken: string}> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user || user.refreshToken !== refreshToken) {
    throw new CustomError(401, "리프레시 토큰이 유효하지 않습니다.");
  }
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  return { accessToken, newRefreshToken };
};

const logout = async () => {
  
}

const service = {
  login,
  logout,
  register,
  refreshToken,
};
export default service;
