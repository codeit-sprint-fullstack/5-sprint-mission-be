"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_routes_1 = __importDefault(require("./articles/articles.routes"));
const products_routes_1 = __importDefault(require("./products/products.routes"));
const comments_routes_1 = __importDefault(require("./comments/comments.routes"));
const user_routes_1 = __importDefault(require("./users/user.routes"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const router = express_1.default.Router();
router.use("/articles", articles_routes_1.default);
router.use("/products", products_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/comments", comments_routes_1.default);
exports.default = router;
