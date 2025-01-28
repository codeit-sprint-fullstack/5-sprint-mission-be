import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token || token === "") {
    return res.status(401).json({ message: "인증 토큰이 없습니다." });
  }

  try {
    const data = jwt.verify(token, process.env.ACCESS_SECRETE);
    req.data = data;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "로그인 해주세요." });
    }
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
