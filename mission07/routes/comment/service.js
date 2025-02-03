import prisma from "../../prismaClient.js";

// 게시글에 해당하는 댓글 리스트 조회
// 커서기반 페이지네이션 해야함.
const getCommentList = async (req, res) => {
    const id = req.params.id;
    const { lastId, pageSize } = req.query;
    try {
            const comments = await prisma.comment.findMany({
                where: {
                    OR:[ 
                        { 
                            productId : id, 
                        },
                        { 
                            articleId: id,
                        },
                    ]
                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                },
                take: pageSize,
                skip: lastId? 1:0,
                ...(lastId && {cursor: { id: lastId }})
            })
            res.status(200).send(comments);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' });
    }
}

// 게시글에 댓글 달기
const postCommentArticle = async (req, res) => {
    const articleId = req.params.articleId;

    try {
        const article = await prisma.article.findUnique({
            where: {
                id: articleId,
            }
        })
        if(!article) return res.status(404).send({message: '아이디에 해당하는 게시글이 없습니다.'});

        const newComment = await prisma.comment.create({
            data: {
                ...req.body,
                articleId,
            }
        })
        res.status(200).send(newComment); 
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

// 상품에 댓글 달기
const postCommentProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            }
        })
        if(!product) return res.status(404).send({message: '아이디에 해당하는 게시글이 없습니다.'});

        const newComment = await prisma.comment.create({
            data: {
                ...req.body,
                productId,
            }
        })
        res.status(200).send(newComment);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

// 댓글 삭제
const deleteComment = async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.comment.delete({
            where: {
                id,
            }
        })
        res.status(200).send({ message: '댓글 삭제 완료'}); // 아이디에 해당하는 댓글이 없을 시 에러 처리해야함.
    } catch {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

// 댓글 수정
const patchComment = async (req, res) => {
    const id = req.params.id;
    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id,
            }
        })
        if(!comment) return res.status(404).send({message: '아이디에 해당하는 댓글이 없습니다.'});

        const updatedComment = await prisma.comment.update({
            where: {
                id,
            },
            data: req.body,
        })
        res.status(200).send(updatedComment); // id에 해당하는 댓글이 없으면 에러처리
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

const service = {
    getCommentList,
    postCommentArticle,
    deleteComment,
    patchComment,
    postCommentProduct,
}

export default service;