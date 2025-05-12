"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./auth/controller"));
const controller_2 = __importDefault(require("./products/controller"));
const controller_3 = __importDefault(require("./articles/controller"));
const controller_4 = __importDefault(require("./shared/comments/controller"));
const router = express_1.default.Router();
router.use("/auth", controller_1.default);
router.use("/products", controller_2.default);
router.use("/articles", controller_3.default);
router.use("/comments", controller_4.default);
exports.default = router;
//# sourceMappingURL=index.js.map