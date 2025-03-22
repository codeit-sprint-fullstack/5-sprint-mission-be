import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const validateUser = async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith("Bearer google ")) {
      const token = req.headers.authorization.split(" ")[2];

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

        req.user = user;
        return next();
      } catch (error) {
        return next({ status: 401, message: "구글 토큰 검증 실패" });
      }
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next({ status: 401, message: "인증이 필요합니다." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return next({ status: 401, message: "리프레시 토큰이 없습니다." });
        }

        try {
          const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
          );
          const newAccessToken = jwt.sign(
            { id: decodedRefreshToken.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          return res.json({ accessToken: newAccessToken });
        } catch (error) {
          return next({
            status: 401,
            message: "리프레시 토큰이 유효하지 않거나 만료되었습니다.",
          });
        }
      }
      return next({
        status: 401,
        message: "토큰이 유효하지 않거나 만료되었습니다.",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return next({ status: 401, message: "유효하지 않은 사용자입니다." });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
