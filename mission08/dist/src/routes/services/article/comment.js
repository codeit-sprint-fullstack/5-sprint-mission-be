"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticleComment = exports.updateArticleComment = exports.createArticleComment = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const requestHandler_1 = __importDefault(require("../../../utils/requestHandler"));
// 댓글 작성
exports.createArticleComment = (0, requestHandler_1.default)(async (req, res) => {
    const articleId = req.params.id;
    const { content } = req.body;
    const comment = await prisma_1.default.articleComment.create({
        data: {
            content,
            articleId,
        },
    });
    res.send(comment);
});
// 댓글 수정
exports.updateArticleComment = (0, requestHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    console.log("id: ", id, "content: ", content);
    const updatedComment = await prisma_1.default.articleComment.update({
        where: { id },
        data: { content },
    });
    res.send(updatedComment);
});
// 댓글 삭제
exports.deleteArticleComment = (0, requestHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    await prisma_1.default.articleComment.delete({
        where: { id },
    });
    res.send({ message: "댓글이 삭제되었습니다." });
});
