import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";

/**
 * id로 유저 정보 조회
 * @param {string} id - 유저 ID
 * @returns {Object} - 유저 정보
 */
const findById = async (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

/**
 * 이메일로 유저 정보 조회
 * @param {string} email - 유저 이메일
 * @returns {Object} - 유저 정보
 */
const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

/**
 * 유저 정보 생성
 * @param {Object} user - 유저 정보
 * @returns {Object} - 유저 정보
 */
const save = async (user) => {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
};

// const update = async (id, data) => {
//   return prisma.user.update({
//     where: {
//       id,
//     },
//     data: data,
//   });
// };

/**
 * 유저 정보 생성 또는 업데이트 - 소셜로그인
 * @param {string} provider - 유저 제공자
 * @param {string} providerId - 유저 제공자 ID
 * @param {string} email - 유저 이메일
 * @param {string} nickname - 유저 닉네임
 * @returns {Object} - 유저 정보
 */
const createOrUpdate = async (provider, providerId, email, nickname) => {
  return prisma.user.upsert({
    where: { provider, providerId },
    update: { email, nickname },
    create: { provider, providerId, email, nickname },
  });
};

/**
 * 유저 정보에서 비밀번호 필터링
 * @param {Object} user - 유저 정보
 * @returns {Object} - 비밀번호 필터링된 유저 정보
 */
const filterSensitiveUserData = (user) => {
  const { password, ...rest } = user;
  return rest;
};

/**
 * 비밀번호 검증
 * @param {string} inputPassword - 입력받은 비밀번호
 * @param {string} password - 데이터베이스에 저장된 비밀번호
 */
const verifyPassword = async (inputPassword, savedPassword) => {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.code = 401;
    throw error;
  }
};

/**
 * 비밀번호 해싱
 * @param {string} password - 비밀번호
 * @returns {string} - 해싱된 비밀번호
 */
const hashingPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * 인증되지 않은 경우 401 에러 발생시킴
 * @returns {Error} - 401 에러
 */
const throwUnauthorizedError = () => {
  const error = new Error("Unauthorized");
  error.code = 401;
  throw error;
};

export default {
  findById,
  findByEmail,
  save,
  createOrUpdate,
  filterSensitiveUserData,
  verifyPassword,
  hashingPassword,
  throwUnauthorizedError,
};
