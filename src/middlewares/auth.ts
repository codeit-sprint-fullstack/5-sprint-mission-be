import { Request, Response, NextFunction, RequestHandler } from "express";
import userUtils from "../utils/userUtils";
import jwtUtils from "../utils/jwtUtils";

interface UserRequest extends Request {
  user?: {
    id: string;
    email: string;
    nickname: string;
  };
}

const verifyToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 쿠키에서 토큰 가져오기
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        status: 401,
        path: req.path,
        method: req.method,
        message: "로그인 후 이용해주세요.",
      });
      return;
    }

    // 토큰 검증
    const decoded = jwtUtils.verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        status: 401,
        path: req.path,
        method: req.method,
        message: "유효하지 않은 토큰입니다.",
      });
      return;
    }

    const user = await userUtils.findById(decoded.userId);

    // 유저id가 데이터베이스에 존재하지 않으면 인증 실패
    if (!user) {
      res.status(401).json({
        status: 401,
        path: req.path,
        method: req.method,
        message: "로그인 후 이용해주세요.",
      });
      return;
    }

    // 이후 편리성을 위한 유저 정보 전달
    (req as UserRequest).user = {
      id: decoded.userId,
      email: user.email,
      nickname: user.nickname,
    };

    // 사용자가 로그인되어 있다면 다음 미들웨어 처리
    next();
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

const optionalVerifyToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;

    // 토큰이 없는 경우 그냥 다음 미들웨어로 진행
    if (!token) {
      return next();
    }

    // 토큰이 있는 경우 검증
    const decoded = jwtUtils.verifyToken(token);

    if (!decoded) {
      return next();
    }

    const user = await userUtils.findById(decoded.userId);

    if (!user) {
      return next();
    }

    // 유저 정보 설정
    (req as UserRequest).user = {
      id: decoded.userId,
      email: user.email,
      nickname: user.nickname,
    };

    next();
  } catch (error) {
    // 토큰 검증 실패시에도 다음 미들웨어로 진행
    next();
  }
};

export default {
  verifyToken,
  optionalVerifyToken,
};
