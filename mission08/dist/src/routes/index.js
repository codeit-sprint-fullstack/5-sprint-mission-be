"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_1 = __importDefault(require("./controllers/article"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send("🐼Panda Market Server!");
});
router.use("/article", article_1.default);
exports.default = router;
