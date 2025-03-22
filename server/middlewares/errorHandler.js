const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
    });
  }

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "요청한 리소스를 찾을 수 없습니다.",
      });
    }
    return res.status(400).json({
      success: false,
      message: "잘못된 요청입니다.",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "입력값이 유효하지 않습니다.",
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      message: "인증되지 않은 요청입니다.",
    });
  }

  if (err.name === "ForbiddenError") {
    return res.status(403).json({
      success: false,
      message: "권한이 없습니다.",
    });
  }

  if (err.name === "NotFoundError") {
    return res.status(404).json({
      success: false,
      message: "요청한 리소스를 찾을 수 없습니다.",
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
