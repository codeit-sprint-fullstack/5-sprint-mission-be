import prisma from "../../prismaClient.js";

// 게시글 리스트 조회
// offset 기반 페이지네이션
const getArticleList = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, keyword = '', order = 'newest' } = req.query;
        let orderOption;
        switch (order) {
            case "newest" :
                orderOption = { createdAt: 'desc' };
                break;
        }

        const articles = await prisma.article.findMany({
            where: {
                OR: [
                    { title: {
                        contains: keyword,
                    } },
                    { content: {
                        contains: keyword,
                    } },
                ]
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
            orderBy: orderOption,
            skip: (Number(page)-1)*Number(pageSize),
            take: Number(pageSize),
        })
        res.status(200).send(articles);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

// 게시글 등록
const postArticle = async (req, res) => {
    try {
        const newArticle = await prisma.article.create({
            data: req.body,
        })
        res.send(newArticle);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

// 게시글 수정
const patchArticle = async (req, res) => {
    try {
        const id = req.params.id;
        try {
            const updatedArticle = await prisma.article.update({
                where: {
                    id: id,
                },
                data: req.body,
            })
            res.send(updatedArticle);
        } catch (err) {
            res.status(404).send({ message: '아이디에 해당하는 게시글을 찾지 못했습니다.' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

// 게시글 단일 조회
const getArticle = async (req, res) => {
    try {
        const id = req.params.id;
        try {
            const article = await prisma.article.findUnique({
                where: {
                    id,
                }
            })
            res.status(200).send(article);
        } catch (err) {
            res.status(400).send({ message: '올바른 id값을 입력하세요.' });
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

// 게시글 삭제
const deleteArticle = async (req, res) => {
    try {
        const id = req.params.id;
        try {
            const article = await prisma.article.delete({
                where: {
                    id,
                }
            })
            res.status(200).send({ message: '삭제 완료'});
        } catch (err) {
            res.status(400).send({ message: '올바른 id값을 입력하세요.' });
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '예기치 못한 오류 발생!' })
    }
}

const service = {
    getArticleList,
    postArticle,
    patchArticle,
    getArticle,
    deleteArticle,
}

export default service;