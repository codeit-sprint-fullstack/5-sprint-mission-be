import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import prisma from "../config/prismaClient";
import { z } from "zod";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { OAuth2Client } from "google-auth-library";

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (user: { id: string }) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "1h") as unknown as SignOptions["expiresIn"];

  if (!secret) {
    throw {
      status: 500,
      message: "JWT_SECRET 설정이 누락되었습니다.",
    };
  }

  return jwt.sign({ id: user.id }, secret, { expiresIn });
};

const generateRefreshToken = (user: { id: string }) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ||
    "30d") as unknown as SignOptions["expiresIn"];

  if (!secret) {
    throw {
      status: 500,
      message: "JWT_REFRESH_SECRET 설정이 누락되었습니다.",
    };
  }

  return jwt.sign({ id: user.id }, secret, { expiresIn });
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.body;

  if (!code) {
    return next({ status: 400, message: "Authorization code가 필요합니다." });
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("구글 토큰 교환 실패:", errorData);
      return next({ status: 400, message: "구글 토큰 교환 실패" });
    }

    const tokenData = await tokenResponse.json();

    const { id_token } = tokenData;

    if (!id_token) {
      return next({ status: 400, message: "id_token이 없습니다." });
    }

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return next({ status: 400, message: "구글 사용자 정보가 부족합니다." });
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          nickname: payload.name,
          image: payload.picture,
          encryptedPassword: "google-oauth",
        },
      });
    }

    const accessTokenJWT = generateAccessToken(user);
    const refreshTokenJWT = generateRefreshToken(user);

    res.cookie("accessToken", accessTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokenJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: accessTokenJWT,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("구글 로그인 에러:", error);
    next(error);
  }
};

export const signUp = async (
  req: Request<{}, {}, RegisterDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, nickname, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next({ status: 409, message: "이미 사용 중인 이메일입니다." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, nickname, encryptedPassword },
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        image: newUser.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next({ status: 401, message: "존재하지 않는 사용자입니다." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.encryptedPassword
    );
    if (!isPasswordValid) {
      return next({ status: 401, message: "비밀번호가 잘못되었습니다." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next({ status: 401, message: "리프레시 토큰이 존재하지 않습니다." });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return next({ status: 401, message: "유효하지 않은 사용자입니다." });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return next({
      status: 401,
      message: "리프레시 토큰이 유효하지 않거나 만료되었습니다.",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({ message: "로그아웃 성공" });
};
