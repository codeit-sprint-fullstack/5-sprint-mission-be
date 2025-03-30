"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const product_routes_1 = __importDefault(require("./product/product.routes"));
// import articleRoutes from "./articles/articles.routes";
const comment_routes_1 = __importDefault(require("./comment/comment.routes"));
// import favoriteRoutes from "./favorites/favorites.routes";
const router = express_1.default.Router();
// 각 도메인별 라우트 등록
router.use("/auth", auth_routes_1.default);
router.use("/products", product_routes_1.default);
router.use("/comments", comment_routes_1.default);
// 건강 체크 엔드포인트 (선택적)
router.get(`/health`, (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});
// 기본 엔드포인트 (선택적)
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to eunbi's Panda market",
    });
});
// 404 처리 (선택적)
router.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
exports.default = router;
