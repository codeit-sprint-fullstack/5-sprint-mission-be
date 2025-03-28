var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../prismaClient.js";
// 게시글에 해당하는 댓글 리스트 조회
// 커서기반 페이지네이션 해야함.
const getCommentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { lastId, pageSize } = req.query;
    try {
        const comments = yield prisma.comment.findMany(Object.assign({ where: {
                OR: [
                    {
                        productId: id,
                    },
                    {
                        articleId: id,
                    },
                ],
            }, select: {
                id: true,
                content: true,
                createdAt: true,
            }, orderBy: {
                createdAt: "desc",
            }, take: pageSize, skip: lastId ? 1 : 0 }, (lastId && { cursor: { id: lastId } })));
        res.status(200).send({ comments });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "예기치 못한 오류 발생!" });
    }
});
// 게시글에 댓글 달기
const postCommentArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = req.params.articleId;
    try {
        const article = yield prisma.article.findUnique({
            where: {
                id: articleId,
            },
        });
        if (!article)
            return res
                .status(404)
                .send({ message: "아이디에 해당하는 게시글이 없습니다." });
        const newComment = yield prisma.comment.create({
            data: Object.assign(Object.assign({}, req.body), { articleId }),
        });
        res.status(200).send(newComment);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "예기치 못한 오류 발생!" });
    }
});
// 상품에 댓글 달기
const postCommentProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = yield prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!product)
            return res
                .status(404)
                .send({ message: "아이디에 해당하는 게시글이 없습니다." });
        const newComment = yield prisma.comment.create({
            data: Object.assign(Object.assign({}, req.body), { productId }),
        });
        res.status(200).send(newComment);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "예기치 못한 오류 발생!" });
    }
});
// 댓글 삭제
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield prisma.comment.delete({
            where: {
                id,
            },
        });
        res.status(200).send({ message: "댓글 삭제 완료" }); // 아이디에 해당하는 댓글이 없을 시 에러 처리해야함.
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "예기치 못한 오류 발생!" });
    }
});
// 댓글 수정
const patchComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const comment = yield prisma.comment.findUnique({
            where: {
                id,
            },
        });
        if (!comment)
            return res
                .status(404)
                .send({ message: "아이디에 해당하는 댓글이 없습니다." });
        const updatedComment = yield prisma.comment.update({
            where: {
                id,
            },
            data: req.body,
        });
        res.status(200).send(updatedComment); // id에 해당하는 댓글이 없으면 에러처리
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: "예기치 못한 오류 발생!" });
    }
});
const service = {
    getCommentList,
    postCommentArticle,
    deleteComment,
    patchComment,
    postCommentProduct,
};
export default service;
