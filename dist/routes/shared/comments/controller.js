"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/:domainId", service_1.default.getComments);
// 댓글 목록 조회 제외한 모든 라우트에 verifyToken 미들웨어 적용
router.use("/", auth_1.default.verifyToken);
router.post("/:domainId", service_1.default.createComment);
router.patch("/:id", service_1.default.patchComment);
router.delete("/:id", service_1.default.deleteComment);
exports.default = router;
//# sourceMappingURL=controller.js.map