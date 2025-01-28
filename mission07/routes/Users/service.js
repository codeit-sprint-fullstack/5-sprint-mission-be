import * as dotenv from "dotenv";
dotenv.config();
import asyncHandler from "../asyncHandler.js";
import { assert } from "superstruct";
import { CreateUser, PatchUser } from "../../structs.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getInfo = asyncHandler(async (req, res) => {
  const nick = req.data.nick;

  if (!nick) {
    return res.status(403).send({ message: "로그인이 필요합니다." });
  }

  res.status(200).send({ message: "로그인 성공", nick });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) {
    return res
      .status(403)
      .send({ user, message: "회원가입되지 않은 이메일입니다." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(403).send({ message: "비밀번호가 일치하지 않습니다." });
  }

  // jwt 토큰 생성
  const accessToken = jwt.sign(
    { id: user.id, nick: user.nick },
    process.env.ACCESS_SECRETE,
    {
      expiresIn: "1h",
      issuer: "Min Ji-Yeong",
    }
  );
  const refreshToken = jwt.sign(
    { id: user.id, nick: user.nick },
    process.env.REFRESH_SECRETE,
    {
      expiresIn: "24h",
      issuer: "Min Ji-Yeong",
    }
  );

  // 토큰 쿠키로 전송
  res.cookie("accessToken", accessToken, {
    secure: false,
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  res.send({ message: "로그인 성공" });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token || token === "") {
    return res.status(401).json({ message: "인증 토큰이 없습니다." });
  }

  // refresh 토큰 검증
  const data = jwt.verify(token, process.env.REFRESH_SECRETE);

  // access 토큰 재발급
  const accessToken = jwt.sign(
    { id: data.id, nick: data.nick },
    process.env.ACCESS_SECRETE,
    {
      expiresIn: "1h",
      issuer: "Min Ji-Yeong",
    }
  );

  // access 토큰 쿠키로 전송
  res.cookie("accessToken", accessToken, {
    secure: false,
    httpOnly: true,
  });

  res.send({ message: "토큰이 갱신되었습니다." });
});

export const logout = asyncHandler(async (req, res) => {
  req.cookie("accessToken", "");
  res.status(200).send("로그아웃 성공");
});

export const createUser = asyncHandler(async (req, res) => {
  const { email, password, nick } = req.body;
  assert(req.body, CreateUser);

  const exUser = await prisma.user.findUnique({ where: { email } });
  if (exUser) {
    return res.status(403).send({ message: "이미 가입된 이메일입니다." });
  }

  const exNick = await prisma.user.findUnique({ where: { nick } });
  if (exNick) {
    return res.status(403).send({ message: "이미 사용중인 닉네임입니다." });
  }

  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      nick,
    },
  });

  res.status(201).send({ message: "회원가입 성공" });
});

export const updateUser = asyncHandler(async (req, res) => {
  assert(req.body, PatchUser);
  const { id } = req.userId;
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.send(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.userId;
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
});
