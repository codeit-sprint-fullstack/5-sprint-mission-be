import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";
import { RegisterStruct, LoginStruct } from "../../structs.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const googleLogin = async (req, res, next) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          nickname: payload.name,
          image: payload.picture,
        },
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

export const signUp = async (req, res, next) => {
  try {
    const [error, validatedData] = RegisterStruct.validate(req.body);
    if (error) {
      return next({ status: 400, message: "잘못된 입력 형식" });
    }

    const { email, nickname, password } = validatedData;

    if (!validatedData) {
      return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next({ status: 400, message: "이미 존재하는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        nickname,
        encryptedPassword: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

export const login = async (req, res, next) => {
  try {
    const [error, validatedData] = LoginStruct.validate(req.body);
    if (error) {
      return next({ status: 400, message: "잘못된 입력 형식" });
    }

    const { email, password } = validatedData;

    if (!validatedData) {
      return next({
        status: 400,
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next({ status: 401, message: "이메일이 잘못되었습니다." });
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next({ status: 401, message: "리프레시 토큰이 존재하지 않습니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return next({ status: 401, message: "유효하지 않은 사용자입니다." });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next({
      status: 401,
      message: "리프레시 토큰이 유효하지 않거나 만료되었습니다.",
    });
  }
};
