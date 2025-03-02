import { Request, Response, NextFunction } from "express";
import { StructError } from "superstruct";
import { Prisma } from "@prisma/client";

// 오류 처리 미들웨어
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prisma 오류 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma의 구체적인 오류 코드를 체크할 수 있음
    if (err.code === "P2002") {
      return res.status(400).send({ message: "이미 존재하는 항목입니다." });
    }
    return res.status(400).send({ message: `Prisma 오류: ${err.message}` });
  }

  // StructError 처리
  if (err instanceof StructError) {
    return res.status(400).send({ message: err.message });
  }

  // 기타 오류 처리
  res
    .status(500)
    .send({ message: "서버 오류가 발생했습니다.", error: err.message });
};

export default errorHandler;
