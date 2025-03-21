import userUtils from "../../utils/userUtils.js";

// TODO: 회원가입/로그인 테스트완료, 나머지는 프론트에서도 해당 로그인/회원가입 기능 잘 되는지, 쿠키에 저장잘되는지 확인 후 상품 테스트 해보고, + 게시글/댓글 기능 추가하기
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

    // 세션에 유저id 저장
    req.session.userId = loginUser.id;

    return res.status(200).json(loginUser);
  } catch (e) {
    next(e);
  }
};

const service = {
  signup,
  signin,
};

export default service;
