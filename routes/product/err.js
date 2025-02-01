const Err = (res, err) => {
  console.error(err);

  // 기본 에러 응답
  let statusCode = 500;
  let message = "서버 오류가 발생했습니다";

  // Mongoose ValidationError 처리
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "유효성 검사 오류가 발생했습니다";
  }
  // Mongoose CastError 처리
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "잘못된 ID 형식입니다";
  }
  // 데이터베이스 연결 오류 처리
  else if (err.message.includes("ECONNREFUSED")) {
    statusCode = 503;
    message = "데이터베이스 연결 오류가 발생했습니다";
  }
  // 데이터가 없는 경우 처리
  else if (err.message.includes("No data found")) {
    statusCode = 404;
    message = "데이터를 찾을 수 없습니다";
  }
  // 기타 에러 처리
  else if (err.message.includes("duplicate key error")) {
    statusCode = 409;
    message = "중복된 키 오류가 발생했습니다";
  }
  // 조작 하지 못한 에러가 발생 했을 때
  else {
    statusCode = 999;
    message = "상상도 못한 오류 어떻게 했어?";
  }

  // 상황에 맞는 오류 보내기
  res.status(statusCode).json({
    message: message,
    error: err.message,
  });
};

export default Err;
