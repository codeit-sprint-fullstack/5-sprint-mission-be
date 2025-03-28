import multer from "multer";
import path from "path";
import fs from "fs";

// 업로드 디렉토리가 없으면 생성
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
export const handleImageUpload = (req, res, next) => {
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

    // req.body가 undefined인 경우 초기화
    if (!req.body) {
      req.body = {};
    }

    if (req.files && req.files.length > 0) {
      // 업로드된 파일 경로를 req.body.images 배열에 저장
      // 경로 구분자 통일 (Windows에서 발생할 수 있는 문제 해결)
      req.body.images = req.files.map(
        (file) => `/${file.path.replace(/\\/g, "/")}`
      );
    } else {
      // 이미지가 없는 경우 빈 배열 설정
      req.body.images = [];
    }

    // FormData에서 tags 처리
    if (req.body.tags && !Array.isArray(req.body.tags)) {
      if (typeof req.body.tags === "string") {
        req.body.tags = [req.body.tags];
      } else {
        req.body.tags = [];
      }
    }
    next();
  });
};
