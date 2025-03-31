import express, { NextFunction, Request, Response, Router } from "express";
import service from "./service.ts";
import auth from "../../middleware/auth.ts";
import prisma from "../../prismaClient.js";

const router: Router = express.Router();

router.post(
  "/signIn",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).send({ message: "로그인 형식 에러" });
        return;
      }
      const result = await service.login(email, password);
      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(result.status).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);
router.post(
  "/signUp",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, nickname, password } = req.body;
    try {
      if (
        typeof email !== "string" ||
        typeof nickname !== "string" ||
        typeof password !== "string"
      ) {
        res.status(400).send({ message: "회원가입 형식 에러" });
        return;
      }

      const existEmail = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existEmail) {
        res.status(400).send({ message: "이미 사용중인 이메일입니다." });
        return;
      }

      const result = await service.register(email, nickname, password);
      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(result.status).send(result.data);
    } catch (err) {
      next(err);
    }
  }
);
router.post("/signOut",async(req:Request, res:Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).send({message: "로그아웃 완료"})
} ,service.logout);
router.post(
  "/refresh-token",
  auth.verifyRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;
      const userId = req.auth?.id as number;
      const { accessToken, newRefreshToken } = await service.refreshToken(
        userId,
        refreshToken,
        next
      );
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: newRefreshToken },
      });
      res.json({ accessToken });
      return;
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
