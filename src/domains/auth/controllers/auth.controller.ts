import { SignInRequest } from '../dtos/signin.dto';
import { SignUpRequest } from '../dtos/signup.dto';
import authService from '../services/auth.service';
import { AuthResponse } from '../interfaces/auth.interface';
import { ApiSignature } from '../../../utils/apiResponse.interface';

// 회원가입
const signUp: ApiSignature = async (req, res) => {
  const data: SignUpRequest = req.body;

  const { accessToken, refreshToken, user } = await authService.signUp(data);

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

  const response: AuthResponse = { accessToken, refreshToken, user }

  res.status(201).send(response);
};

// 로그인
const signIn: ApiSignature = async (req, res) => {
  const data: SignInRequest = req.body;

  const { accessToken, refreshToken, user } = await authService.signIn(data);

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

  const response: AuthResponse = { accessToken, refreshToken, user }

  res.status(201).send(response);
};

// access token 리프레쉬
const refresh: ApiSignature = async (req, res) => {
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
