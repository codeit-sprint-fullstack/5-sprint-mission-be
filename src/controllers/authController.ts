import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { UnauthorizedException } from "@/exceptions/UnauthorizedExceptions";
import { User } from "@/generated/prisma";
import authService from "@/services/authService";
import { PostController } from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import createSuccessResponse from "@/utils/createSuccessResponse";
import { UserCreateInput, UserLoginInput } from "@/validators/userValidator";
import type { ParamsDictionary } from "express-serve-static-core";

const createUser: PostController<
  ParamsDictionary,
  UserCreateInput,
  SuccessResponse<Omit<User, "encryptedPassword">>
> = async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;
    const result = await authService.registerUser({
      email,
      password,
      nickname,
    });

    req.session.userId = result.data.id;
    req.session.isLoggedIn = true;

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const loginUser: PostController<
  ParamsDictionary,
  UserLoginInput,
  SuccessResponse<Omit<User, "encryptedPassword">>
> = async (req, res, next) => {
  try {
    // 1. 이미 로그인된 경우 체크
    if (req.session.userId) {
      throw new BadRequestException("이미 로그인 중입니다.");
    }

    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    // 2. 세션 정보 할당
    req.session.userId = result.data.id;
    req.session.isLoggedIn = true;

    // 3. 명시적 세션 저장 (Promise 버전)
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(new Error("세션 저장 실패"));
        else resolve();
      });
    });

    // 4. 응답 전송
    res.status(200).send(result);

  } catch (err) {
    next(err);
  }
};

const logoutUser: PostController<
  ParamsDictionary,
  Record<string, never>,
  SuccessResponse<null>
> = async (req, res, next) => {
  try {
    const user = req.session.userId;
    if (!user) throw new UnauthorizedException();
    req.session.destroy((err) => {
      res.clearCookie("connect.sid");

      const result = createSuccessResponse<null>(null, "로그아웃 되었습니다.");
      res.status(200).send(result);
    });
  } catch (err) {
    next(err);
  }
};

const authController = {
  createUser,
  loginUser,
  logoutUser,
};

export default authController;
