import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

interface CustomError extends Error {
  code?: number;
}

/**
 * ID로 유저 찾기
 * @param {string} id - 유저 ID
 * @returns {Object} - 유저 정보
 */
const findById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id: id,
      deletedAt: null, // 삭제되지 않은 유저만 조회
    },
  });
};

/**
 * 이메일로 유저 찾기
 * @param {string} email - 이메일
 * @returns {Object} - 유저 정보
 */
const findByEmail = async (email: string): Promise<User | null> => {
  try {
    return await prisma.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });
  } catch (error) {
    console.error("Error in findByEmail:", error);
    throw error;
  }
};

/**
 * 유저 데이터 저장
 * @param {Object} userData - 저장할 유저 데이터
 * @returns {Object} - 저장된 유저 정보
 */
const save = async (userData: {
  email: string;
  password: string;
  nickname: string;
}): Promise<User> => {
  return await prisma.user.create({
    data: userData,
  });
};

/**
 * 유저 데이터 비밀번호 필터링
 * @param {Object} user - 필터링할 유저 데이터
 * @returns {Object} - 필터링된 유저 정보
 */
const filterSensitiveUserData = (user: User) => {
  const { password, ...filteredUser } = user;
  return filteredUser;
};

/**
 * 비밀번호 검증
 * @param {string} password - 검증할 비밀번호
 * @param {string} hashedPassword - 해싱된 비밀번호
 * @returns {boolean} - 검증 결과
 */
const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.name = "UnauthorizedError";
    throw error;
  }
  return true;
};

/**
 * 비밀번호 해싱
 * @param {string} password - 원본 비밀번호
 * @returns {string} - 해싱된 비밀번호
 */
const hashingPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * 인증되지 않은 경우 401 에러 발생시킴
 * @returns {Error} - 401 에러
 */
const throwUnauthorizedError = (): never => {
  const error: CustomError = new Error("Unauthorized");
  error.code = 401;
  throw error;
};

const userUtils = {
  findByEmail,
  findById,
  hashingPassword,
  verifyPassword,
  save,
  filterSensitiveUserData,
  throwUnauthorizedError,
};

export default userUtils;
