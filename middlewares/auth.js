import userUtils from "../utils/userUtils.js";
import jwtUtils from "../utils/jwtUtils.js";

const verifyToken = async (req, res, next) => {
  try {
    // 쿠키에서 토큰 가져오기
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: 401,
        path: req.path,
        method: req.method,
        message: "로그인 후 이용해주세요.",
      });
    }

    // 토큰 검증
    const decoded = jwtUtils.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        status: 401,
        path: req.path,
        method: req.method,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    const user = await userUtils.findById(decoded.userId);

    // 유저id가 데이터베이스에 존재하지 않으면 인증 실패
    if (!user) {
      return res.status(401).json({
        status: 401,
        path: req.path,
        method: req.method,
        message: "로그인 후 이용해주세요.",
      });
    }

    // 이후 편리성을 위한 유저 정보 전달
    req.user = {
      id: decoded.userId,
      email: user.email,
      nickname: user.nickname,
      provider: user.provider,
      providerId: user.providerId,
    };

    // 사용자가 로그인되어 있다면 다음 미들웨어 처리
    next();
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

export default {
  verifyToken,
};
