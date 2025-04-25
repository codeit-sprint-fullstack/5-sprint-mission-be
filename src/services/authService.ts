import prisma from "@/config/database";
import { SuccessResponse } from "@/types/response";
import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { comparePassword, hashPassword } from "@/utils/hash";
import { User } from "@/generated/prisma";
import { SigninDto, SignupDto } from "@/models/auth";
import createSuccessResponse from "@/utils/createSuccessResponse";

async function registerUser(
  createUserInput: SignupDto
): Promise<SuccessResponse<Omit<User, "encryptedPassword">>> {
  const secretPassword = await hashPassword(createUserInput.password);

  const existUserEmail = await prisma.user.findFirst({
    where: {
      email: createUserInput.email,
    },
  });

  if (existUserEmail) {
    throw new BadRequestException("이미 존재하는 이메일입니다.");
  }

  const existNickname = await prisma.user.findFirst({
    where: {
      nickname: createUserInput.nickname,
    },
  });

  if (existNickname) {
    throw new BadRequestException("이미 존재하는 닉네임입니다.");
  }

  const newUser = await prisma.user.create({
    data: {
      email: createUserInput.email,
      encryptedPassword: secretPassword,
      nickname: createUserInput.nickname,
    },
  });

  const { encryptedPassword, ...newUserWithoutPassword } = newUser;

  return createSuccessResponse<Omit<User, "encryptedPassword">>(
    newUserWithoutPassword,
    "회원가입에 성공했습니다!"
  );
}

async function loginUser(
  loginUserInput: SigninDto
): Promise<SuccessResponse<Omit<User, "encryptedPassword">>> {
  const existUser = await prisma.user.findUnique({
    where: {
      email: loginUserInput.email,
    },
  });

  if (!existUser) {
    throw new BadRequestException("존재하지 않는 회원입니다.");
  }

  const isMatch = await comparePassword(
    loginUserInput.password,
    existUser.encryptedPassword
  );

  if (!isMatch) {
    throw new BadRequestException("비밀번호가 일치하지 않습니다.");
  }

  const { encryptedPassword, ...existUserWithoutPassword } = existUser;

  return createSuccessResponse<Omit<User, "encryptedPassword">>(
    existUserWithoutPassword,
    "로그인에 성공하였습니다!"
  );
}

const authService = {
  registerUser,
  loginUser,
};

export default authService;
