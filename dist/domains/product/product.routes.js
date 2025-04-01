"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const multerConfig_1 = require("../../middleware/multerConfig");
const comment_routes_1 = __importDefault(require("../comment/comment.routes"));
const router = (0, express_1.Router)();
// TODO: user 로직 만들어야함
router.get("/", product_controller_1.getProducts);
router.post("/", multerConfig_1.upload.array("images", 3), auth_middleware_1.authenticateJWT, product_controller_1.createProduct);
router.get("/:id", product_controller_1.getProductById);
router.post("/:id/favorite", auth_middleware_1.authenticateJWT, product_controller_1.addFavorite);
router.delete("/:id/favorite", auth_middleware_1.authenticateJWT, product_controller_1.removeFavorite);
router.patch("/:id", multerConfig_1.upload.array("images", 3), auth_middleware_1.authenticateJWT, product_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.authenticateJWT, product_controller_1.deleteProduct);
router.use("/:id/comments", comment_routes_1.default);
exports.default = router;
