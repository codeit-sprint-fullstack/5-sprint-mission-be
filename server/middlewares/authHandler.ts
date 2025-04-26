import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import prisma from "../config/prismaClient";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization || "";

    if (authHeader.startsWith("Bearer google ")) {
      const token = authHeader.split(" ")[2];
      console.log("[🔐 Google Token] 추출된 토큰:", token);

      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email || !payload.name) {
          return next({
            status: 401,
            message: "구글 사용자 정보가 부족합니다.",
          });
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

        req.user = user;
        return next();
      } catch (error) {
        console.error("[❌ Google 토큰 검증 실패]", error);
        return next({ status: 401, message: "구글 토큰 검증 실패" });
      }
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      console.warn("[⚠️ 인증 실패] 토큰 없음");
      return next({ status: 401, message: "인증이 필요합니다." });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
          return next({ status: 401, message: "리프레시 토큰이 없습니다." });
        }

        try {
          const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
          ) as JwtPayload;

          const expiresIn = (process.env.JWT_EXPIRES_IN ||
            "1h") as unknown as SignOptions["expiresIn"];
          const secret = process.env.JWT_SECRET;
          if (!secret) throw new Error("JWT_SECRET is not defined");

          const options: SignOptions = { expiresIn };

          const newAccessToken = jwt.sign(
            { id: decodedRefreshToken.id },
            secret,
            options
          );
          req.headers.authorization = `Bearer ${newAccessToken}`;

          const newDecoded = jwt.verify(newAccessToken, secret) as JwtPayload;
          const user = await prisma.user.findUnique({
            where: { id: newDecoded.id },
          });

          if (!user) {
            console.warn("[❌ 유효하지 않은 사용자 ID]", newDecoded.id);
            return next({
              status: 401,
              message: "유효하지 않은 사용자입니다.",
            });
          }

          req.user = user;
          return next();
        } catch (error) {
          return next({
            status: 401,
            message: "리프레시 토큰이 유효하지 않거나 만료되었습니다.",
          });
        }
      }

      console.error("[❌ 토큰 검증 실패]", err);
      return next({
        status: 401,
        message: "토큰이 유효하지 않거나 만료되었습니다.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.warn("[❌ 유효하지 않은 사용자 ID]", decoded.id);
      return next({ status: 401, message: "유효하지 않은 사용자입니다." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[❌ 인증 미들웨어 에러]", error);
    next(error);
  }
};
