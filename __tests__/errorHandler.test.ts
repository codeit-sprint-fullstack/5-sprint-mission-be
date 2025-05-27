import { Request, Response } from "express";
import errorHandler from "../server/middlewares/errorHandler";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const mockResponse = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorHandler 글로벌 핸들러 테스트", () => {
  it("✅ status가 있는 에러 처리", () => {
    const err = { status: 403, message: "권한 없음" };
    const res = mockResponse();

    errorHandler(err, {} as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "권한 없음",
    });
  });

  it("✅ ZodError 처리", () => {
    const zodErr = new ZodError([
      {
        path: ["email"],
        message: "Invalid email",
        code: "custom",
      },
    ]);
    const res = mockResponse();

    errorHandler(zodErr, {} as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0]).toHaveProperty("errors");
  });

  it("✅ Prisma P2025 에러 처리", () => {
    const prismaError = {
      code: "P2025",
      name: "PrismaClientKnownRequestError",
    } as Prisma.PrismaClientKnownRequestError;

    const res = mockResponse();

    errorHandler(prismaError, {} as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });

  it("✅ JWT 오류 처리", () => {
    const err = { name: "JsonWebTokenError" };
    const res = mockResponse();

    errorHandler(err, {} as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("✅ 알 수 없는 에러는 500 처리", () => {
    const err = new Error("서버 내부 오류");
    const res = mockResponse();

    errorHandler(err, {} as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "서버 내부 오류",
    });
  });
});
