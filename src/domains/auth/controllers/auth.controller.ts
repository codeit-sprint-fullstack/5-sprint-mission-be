import { NextFunction, Request, Response } from 'express';
import { SignInRequest, SignInResponse } from '../dtos/signin.dto';
import { RefreshResponse } from '../dtos/refresh.dto';
import { SignUpRequest, SignUpResponse } from '../dtos/signup.dto';
import authService from '../services/auth.service';
import { UserResponse } from '../../user/dtos/user.dto';

type ApiAuth = (req: Request, res: Response, next: NextFunction) => Promise<void>

// 회원가입
const signUp: ApiAuth = async (req, res) => {
  const data: SignUpRequest = req.body;

  const { accessToken, refreshToken, user } = await authService.signUp(data);

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

  const response: SignUpResponse = { accessToken, refreshToken, user }

  res.status(201).send(response);
};

// 로그인인
const signIn: ApiAuth = async (req, res) => {
  const data: SignInRequest = req.body;

  const { accessToken, refreshToken, user } = await authService.signIn(data);

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

  const response: SignInResponse = { accessToken, refreshToken, user }

  res.status(201).send(response);
};

const refresh: ApiAuth = async (req, res) => {
  const { refreshToken } = req.body;

  const accessToken = await authService.refresh(refreshToken);

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });

  res.status(201).send({ accessToken })
};

const authController = {
  signUp,
  signIn,
  refresh,
};

export default authController;
