import multer from "multer";
import path from "path";

const verifyProductFields = (req, res, next) => {
  // req.body가 문자열로 전달된 경우 파싱
  if (typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      return res
        .status(400)
        .send({ message: "요청 데이터 형식이 올바르지 않습니다." });
    }
  }

  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).send({ message: "모든 필수 필드를 입력해주세요." });
  }

  // 상품이름 10자 이내 검증
  if (name.length > 10) {
    return res
      .status(400)
      .send({ message: "상품 이름은 10자 이내로 입력해주세요." });
  }

  // 상품 설명 10자 이상, 100자 이내 검증
  if (description.length < 10 || description.length > 100) {
    return res
      .status(400)
      .send({ message: "상품 설명은 10자 이상, 100자 이내로 입력해주세요." });
  }

  // 상품 가격 1원 이상 숫자 검증
  if (isNaN(price) || Number(price) < 1) {
    return res
      .status(400)
      .send({ message: "상품 가격은 1원 이상의 숫자로 입력해주세요." });
  }

  next();
};

// 이미지 저장 디렉토리 설정
const uploadDir = "uploads/"; // dest 속성 제거하고 문자열만 지정

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// 파일 필터 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  }
};

// multer 설정
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
    files: 3, // 최대 3개 파일
  },
});

// 이미지 업로드 미들웨어
const uploadImages = upload.array("images", 3);

// 이미지 업로드 처리 미들웨어
const handleImageUpload = (req, res, next) => {
  uploadImages(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer 에러 처리
      if (err.code === "LIMIT_FILE_COUNT") {
        return res
          .status(400)
          .send({ message: "이미지는 최대 3개까지 업로드 가능합니다." });
      } else if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .send({ message: "파일 크기는 5MB 이하여야 합니다." });
      }
      return res
        .status(400)
        .send({ message: "파일 업로드 중 오류가 발생했습니다." });
    } else if (err) {
      // 기타 에러 처리
      return res.status(400).send({ message: err.message });
    }

    if (req.files && req.files.length > 0) {
      // 업로드된 파일 경로를 req.body.images 배열에 저장
      req.body.images = req.files.map((file) => `/${file.path}`);
    } else {
      // 이미지가 없는 경우 빈 배열 설정
      req.body.images = [];
    }

    next();
  });
};

export default {
  verifyProductFields,
  handleImageUpload,
};
