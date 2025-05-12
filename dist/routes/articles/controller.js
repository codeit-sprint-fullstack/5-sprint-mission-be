"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const imageUploadHandler_1 = require("../../middlewares/imageUploadHandler");
const router = express_1.default.Router();
// 목록 조회와 상세 조회는 선택적 인증 적용
router.get("/", auth_1.default.optionalVerifyToken, service_1.default.getArticleList);
router.get("/:id", auth_1.default.optionalVerifyToken, service_1.default.getArticle);
// 나머지 라우트에 필수 인증 미들웨어 적용
router.use("*", auth_1.default.verifyToken);
router.delete("/:id", service_1.default.deleteArticle);
router.post("/:id/like", service_1.default.createLike);
router.delete("/:id/like", service_1.default.deleteLike);
// 게시글 등록, 수정 - 이미지 업로드 미들웨어 적용
router.post("/", imageUploadHandler_1.handleImageUpload, service_1.default.createArticle);
router.patch("/:id", imageUploadHandler_1.handleImageUpload, service_1.default.patchArticle);
exports.default = router;
//# sourceMappingURL=controller.js.map