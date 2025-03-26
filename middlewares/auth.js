import userUtils from "../utils/userUtils.js";

const verifySessionLogin = async (req, res, next) => {
  // 세션에서 사용자 정보를 읽어옴
  try {
    const { userId } = req.session;

    if (!userId) {
      return res.status(401).json({
        status: 401,
        path: req.path,
        method: req.method,
        message: "로그인 후 이용해주세요.",
      });
    }

    const user = await userUtils.findById(req.session.userId);

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
      id: req.session.userId,
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
  verifySessionLogin,
};
