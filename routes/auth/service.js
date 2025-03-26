import userUtils from "../../utils/userUtils.js";
import jwtUtils from "../../utils/jwtUtils.js";

// 회원가입
const signup = async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    // 이메일 중복 여부 확인
    const existedUser = await userUtils.findByEmail(email);

    if (existedUser) {
      const error = new Error("이미 가입된 이메일입니다.");
      error.code = 422;
      throw error;
    }

    // 비밀번호 해싱
    const hashedPassword = await userUtils.hashingPassword(password);

    // 입력받은 데이터로 데이터베이스에 저장
    const createdUser = await userUtils.save({
      email,
      password: hashedPassword,
      nickname,
    });

    // 저장된 데이터에서 비밀번호 필터링하여 response로 전달
    const filteredUserData = userUtils.filterSensitiveUserData(createdUser);

    // JWT 토큰 생성
    const token = jwtUtils.generateToken(filteredUserData.id);

    // 쿠키에 토큰 저장
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1일
    });

    return res.status(201).json(filteredUserData);
  } catch (e) {
    next(e);
  }
};

// 로그인
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 입력받은 데이터로 데이터베이스에서 조회
    const getUser = async (email, password) => {
      // 이메일로 유저 데이터 조회
      const user = await userUtils.findByEmail(email);

      if (!user) {
        const error = new Error("존재하지 않는 이메일입니다.");
        error.code = 401;
        throw error;
      }

      // 등록된 이메일인 경우 비밀번호 검증
      await userUtils.verifyPassword(password, user.password);

      // 비밀번호 검증 통과 후 필터링된 유저 정보 반환
      return userUtils.filterSensitiveUserData(user);
    };

    const loginUser = await getUser(email, password);

    // JWT 토큰 생성
    const token = jwtUtils.generateToken(loginUser.id);

    // 쿠키에 토큰 저장
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1일
    });

    return res.status(200).json(loginUser);
  } catch (e) {
    next(e);
  }
};

// 로그아웃
const signout = async (req, res, next) => {
  try {
    // 쿠키 삭제
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (e) {
    next(e);
  }
};

// 현재 로그인된 사용자 정보 조회
const me = async (req, res, next) => {
  try {
    // auth 미들웨어에서 설정한 user 정보 반환
    return res.status(200).json(req.user);
  } catch (e) {
    next(e);
  }
};

const service = {
  signup,
  signin,
  signout,
  me,
};

export default service;
