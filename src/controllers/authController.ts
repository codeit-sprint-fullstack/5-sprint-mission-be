import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { User } from "@/generated/prisma";
import authService from "@/services/authService";
import { PostController } from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import { UserCreateInput, UserLoginInput } from "@/validators/userValidator";
import type { ParamsDictionary } from 'express-serve-static-core';

const createUser: PostController<
  ParamsDictionary,
  UserCreateInput,
  SuccessResponse<Omit<User, "encryptedPassword">>
> = async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;
    const result = await authService.registerUser({ email, password, nickname });

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
    const user = req.session.userId;
    if(user) throw new BadRequestException('이미 로그인 중입니다.')
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    req.session.userId = result.data.id;
    req.session.isLoggedIn = true;

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

const authController = {
  createUser,
  loginUser,
}

export default authController;