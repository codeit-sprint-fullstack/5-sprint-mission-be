"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const articleCommentRoutes_1 = __importDefault(require("./routes/articleCommentRoutes"));
const productCommentRoutes_1 = __importDefault(require("./routes/productCommentRoutes"));
dotenv_1.default.config({ path: '../.env' });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(errorHandler_1.default);
app.use('/product', productRoutes_1.default);
app.use('/article', articleRoutes_1.default);
app.use('/article/comment', articleCommentRoutes_1.default);
app.use('/product/comment', productCommentRoutes_1.default);
app.listen(process.env.PORT || 3000, () => {
    console.log(`서버 작동중 ${process.env.PORT || 3000}`);
});
exports.default = app;
