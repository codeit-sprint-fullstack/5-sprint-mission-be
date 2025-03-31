import { NextFunction, Request, Response } from "express";
import { expressjwt } from "express-jwt";
import prisma from "../prismaClient.js";
import CustomError from "../types/error.ts";
import AuthRequest from "../types/authRequest.ts";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  requestProperty: "user",
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as string,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
  requestProperty: "auth",
})

const verifyProductChange = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.params.id,
    },
    select: { ownerId: true }, // 필요한 필드만 조회
  });
  if (!product) {
    return next(new CustomError(404, "아이디에 해당하는 상품을 찾을 수 없습니다."))
  }
  console.log("req.user :", req.user);
  if (!req.user) {
    return next(new CustomError(401, "로그인 하지 않은 사용자입니다."))
  }
  if (product.ownerId === req.user.id) {
    return next();
  }
  return next(new CustomError(403, "권한이 없는 사용자입니다."))
};

const verifyArticleChange = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const article = await prisma.article.findUnique({
    where: {
      id: req.params.id,
    },
    select: { authorId: true }, // 필요한 필드만 조회
  });
  if (!article) {
    return next(new CustomError(404, "아이디에 해당하는 상품을 찾을 수 없습니다."))
  }
  if (!req.user) {
    return next(new CustomError(401, "로그인 하지 않은 사용자입니다."))
  }
  if (article.authorId === req.user.id){
    return next();
  }
  return next(new CustomError(403, "권한이 없는 사용자입니다."))
}

const verifyCommentChange = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: req.params.id },
  });
  if (!comment) {
    return next(new CustomError(404, "아이디에 해당하는 댓글을 찾을 수 없습니다."))
  }
  if (!req.user) {
    return next(new CustomError(401, "로그인 하지 않은 사용자입니다."))
  }
  if (comment.authorId === req.user.id) {
    return next();
  }
  return next(new CustomError(403, "권한이 없는 사용자입니다."))
};

const auth = {
  verifyAccessToken,
  verifyRefreshToken,
  verifyProductChange,
  verifyCommentChange,
  verifyArticleChange,
};

export default auth;
