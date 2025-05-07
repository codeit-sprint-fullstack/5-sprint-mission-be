import { Request, Response, NextFunction } from "express";
import prisma from "../config/prismaClient";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next({ status: 401, message: "인증되지 않은 사용자입니다." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next({ status: 404, message: "사용자를 찾을 수 없습니다." });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
