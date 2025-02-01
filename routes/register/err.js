const Err = (err, res) => {
  console.error(err);

  // 기본 에러 응답
  let statusCode = 111;
  let message = "기본값";

  // Mongoose ValidationError 처리
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "유효성 검사 오류가 발생했습니다";
  }
  // Mongoose CastError 처리
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "잘못된 데이터 형식입니다";
  }
  // 데이터베이스 연결 오류 처리
  else if (err.message.includes("ECONNREFUSED")) {
    statusCode = 503;
    message = "데이터베이스 연결 오류가 발생했습니다";
  }
  // 중복 키 오류 처리
  else if (err.message.includes("duplicate key error")) {
    statusCode = 409;
    message = "중복된 키 오류가 발생했습니다";
  }
  // 인증 오류 처리
  else if (err.message.includes("Unauthorized")) {
    statusCode = 401;
    message = "인증 오류가 발생했습니다";
  }
  // 권한 오류 처리
  else if (err.message.includes("Forbidden")) {
    statusCode = 403;
    message = "권한 오류가 발생했습니다";
  }
  // 요청 본문이 비어 있는 경우 처리
  else if (err.message.includes("Request body is empty")) {
    statusCode = 400;
    message = "요청 본문이 비어 있습니다";
  }
  // 컨트롤하지 못한 에러들
  else {
    statusCode = 999;
    message = "어떻게 한거야 이건 도대체 무슨 오류야";
  }

  // 상황에 맞는 오류 보내기
  res.status(statusCode).json({
    message: message,
    error: err.message,
  });
};

export default Err;
