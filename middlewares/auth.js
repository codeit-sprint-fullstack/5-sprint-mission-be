import userUtils from "../utils/userUtils.js";

const verifySessionLogin = async (req, res, next) => {
  // 세션에서 사용자 정보를 읽어옴
  try {
    const { userId } = req.session;

    if (!userId) {
      // 세션에 유저id가 없으면 인증 실패
      userUtils.throwUnauthorizedError();
    }

    const user = await userUtils.findById(req.session.userId);

    // 유저id가 데이터베이스에 존재하지 않으면 인증 실패
    if (!user) {
      userUtils.throwUnauthorizedError();
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
    next(error);
  }
};

export default {
  verifySessionLogin,
};
