"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("../../prismaClient"));
// 전체 게시글 목록 조회
const getArticleList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //페이지네이션
        const page = Number(req.query.page) || 1; //(기본값: 1)
        const limit = Number(req.query.limit) || 100; //(기본값: 100);
        const skip = (page - 1) * limit; //페이지네이션을 위한 skip값 계산
        const sort = req.query.sort || "recent";
        const sortOption = sort === "favorite"
            ? [
                { likeCount: client_1.Prisma.SortOrder.desc },
                { createdAt: client_1.Prisma.SortOrder.desc },
            ]
            : {
                createdAt: sort === "recent" ? client_1.Prisma.SortOrder.desc : client_1.Prisma.SortOrder.asc,
            };
        const keyword = req.query.keyword || "";
        const searchCriteria = {
            AND: [
                {
                    OR: [
                        {
                            title: { contains: keyword, mode: client_1.Prisma.QueryMode.insensitive },
                        },
                        {
                            content: {
                                contains: keyword,
                                mode: client_1.Prisma.QueryMode.insensitive,
                            },
                        },
                    ],
                },
                { deletedAt: null },
            ],
        };
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let likedArticleIds = [];
        if (userId) {
            // 삭제되지 않은 좋아요 정보만 조회
            const userLikes = yield prismaClient_1.default.likeArticle.findMany({
                where: {
                    userId: userId,
                    deletedAt: null,
                },
                select: {
                    articleId: true,
                },
            });
            likedArticleIds = userLikes.map((item) => item.articleId);
        }
        const articles = yield prismaClient_1.default.article.findMany({
            where: searchCriteria,
            orderBy: sortOption,
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                likeCount: true,
                createdAt: true,
                updatedAt: true,
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        const formattedArticles = articles.map((article) => {
            const isLiked = userId ? likedArticleIds.includes(article.id) : false;
            return {
                id: article.id,
                title: article.title,
                content: article.content,
                image: article.image,
                likeCount: article.likeCount,
                isLiked: isLiked,
                ownerId: article.User.id,
                ownerNickname: article.User.nickname,
                createdAt: article.createdAt.toISOString(),
                updatedAt: article.updatedAt.toISOString(),
            };
        });
        const totalArticles = yield prismaClient_1.default.article.count({
            where: searchCriteria,
        });
        const totalPages = Math.ceil(totalArticles / limit);
        res.status(200).send({
            ArticleList: formattedArticles,
            totalArticles,
            totalPages,
        });
    }
    catch (error) {
        next(error);
    }
});
// 게시글 상세 조회
const getArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const article = yield prismaClient_1.default.article.findUnique({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        if (!article) {
            res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
            return;
        }
        // 로그인한 사용자인 경우 좋아요 여부 확인
        let isLiked = false;
        if (userId) {
            // 삭제되지 않은 좋아요 정보만 조회
            const likeExists = yield prismaClient_1.default.likeArticle.findFirst({
                where: {
                    userId: userId,
                    articleId: id,
                    deletedAt: null,
                },
            });
            isLiked = !!likeExists;
        }
        // 사용자가 로그인한 경우 좋아요 정보 추가 + 소유자 정보 추가
        const articleWithLike = Object.assign(Object.assign({}, article), { isLiked: isLiked, ownerId: article.User.id, ownerNickname: article.User.nickname, User: undefined });
        res.status(200).send(articleWithLike);
    }
    catch (error) {
        next(error);
    }
});
// 게시글 등록
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const { title, content } = req.body;
        const { id: userId } = req.user;
        // 이미지 경로 처리
        const image = req.body.images && req.body.images.length > 0 ? req.body.images[0] : null;
        const newArticle = yield prismaClient_1.default.article.create({
            data: {
                userId,
                title,
                content,
                image,
            },
            include: {
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        // 응답에 소유자 정보 추가
        const responseArticle = Object.assign(Object.assign({}, newArticle), { ownerId: newArticle.User.id, ownerNickname: newArticle.User.nickname, User: undefined });
        res.status(201).send(responseArticle);
    }
    catch (error) {
        next(error);
    }
});
// id로 선택한 게시글 수정
const patchArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 인증 확인 - req.user 객체가 없는 경우 에러 발생
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const id = req.params.id;
        const { title, content } = req.body;
        const { id: userId } = req.user;
        // 이미지 경로 처리
        const image = req.body.images && req.body.images.length > 0
            ? req.body.images[0] // 첫 번째 이미지 경로만 사용
            : null;
        // 게시글 존재 여부 확인
        const existingArticle = yield prismaClient_1.default.article.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingArticle) {
            res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
            return;
        }
        // 게시글 소유자 확인
        if (existingArticle.userId !== userId) {
            const error = new Error("게시글을 수정할 권한이 없습니다.");
            error.name = "ForbiddenError";
            throw error;
        }
        const updatedArticle = yield prismaClient_1.default.article.update({
            where: { id },
            data: {
                title,
                content,
                image, // 이미지 경로 업데이트
            },
            include: {
                User: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
        });
        // 응답에 소유자 정보 추가
        const responseArticle = Object.assign(Object.assign({}, updatedArticle), { ownerId: updatedArticle.User.id, ownerNickname: updatedArticle.User.nickname, User: undefined });
        res.status(200).send(responseArticle); //수정된 게시글
    }
    catch (error) {
        next(error);
    }
});
// 게시글 삭제
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 인증 확인 - req.user 객체가 없는 경우 에러 발생
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const id = req.params.id;
        const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기
        // 게시글 존재 여부 확인
        const existingArticle = yield prismaClient_1.default.article.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingArticle) {
            res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
            return;
        }
        // 게시글 소유자 확인
        if (existingArticle.userId !== userId) {
            const error = new Error("게시글을 삭제할 권한이 없습니다.");
            error.name = "ForbiddenError";
            throw error;
        }
        //deletedAt 업데이트
        const deletedArticle = yield prismaClient_1.default.article.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
            select: {
                id: true,
                title: true,
                deletedAt: true,
            },
        });
        if (!deletedArticle) {
            const error = new Error("게시글을 삭제할 수 없습니다.");
            error.name = "NotFoundError";
            throw error;
        }
        res.status(202).send({
            isSuccess: true,
            message: "삭제 처리가 완료되었습니다.",
        });
    }
    catch (error) {
        next(error);
    }
});
// 게시글 좋아요 추가
const createLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 인증 확인 - req.user 객체가 없는 경우 에러 발생
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const { id } = req.params;
        const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기
        // 트랜잭션 사용
        const result = yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 게시글 존재 여부 확인
            const article = yield tx.article.findUnique({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!article) {
                const error = new Error("게시글을 찾을 수 없습니다.");
                error.name = "NotFoundError";
                throw error;
            }
            // 이미 좋아요 했는지 확인
            const existingLike = yield tx.likeArticle.findFirst({
                where: {
                    userId,
                    articleId: id,
                    deletedAt: null,
                },
            });
            if (existingLike) {
                const error = new Error("이미 좋아요한 게시글입니다.");
                error.name = "ValidationError";
                throw error;
            }
            // 좋아요 생성
            const like = yield tx.likeArticle.create({
                data: {
                    userId,
                    articleId: id,
                },
            });
            // 게시글의 좋아요 수 증가
            const updatedArticle = yield tx.article.update({
                where: { id },
                data: {
                    likeCount: { increment: 1 },
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            nickname: true,
                        },
                    },
                },
            });
            return {
                like,
                article: Object.assign(Object.assign({}, updatedArticle), { isLiked: true, ownerId: updatedArticle.User.id, ownerNickname: updatedArticle.User.nickname, User: undefined }),
            };
        }));
        res.status(201).send({
            isSuccess: true,
            data: result.article,
        });
    }
    catch (error) {
        next(error);
    }
});
// 게시글 좋아요 삭제
const deleteLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 인증 확인 - req.user 객체가 없는 경우 에러 발생
        if (!req.user || !req.user.id) {
            const error = new Error("인증이 필요합니다.");
            error.name = "UnauthorizedError";
            throw error;
        }
        const { id } = req.params;
        const { id: userId } = req.user; // 로그인한 사용자 ID 가져오기
        // 트랜잭션 사용
        const result = yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 게시글 존재 여부 확인
            const article = yield tx.article.findUnique({
                where: {
                    id,
                    deletedAt: null,
                },
            });
            if (!article) {
                const error = new Error("게시글을 찾을 수 없습니다.");
                error.name = "NotFoundError";
                throw error;
            }
            // 좋아요 존재 여부 확인
            const existingLike = yield tx.likeArticle.findFirst({
                where: {
                    userId,
                    articleId: id,
                    deletedAt: null,
                },
            });
            if (!existingLike) {
                const error = new Error("좋아요 정보를 찾을 수 없습니다.");
                error.name = "NotFoundError";
                throw error;
            }
            // 좋아요 소프트 삭제 (deletedAt 설정)
            const deletedLike = yield tx.likeArticle.update({
                where: { id: existingLike.id },
                data: {
                    deletedAt: new Date(),
                },
            });
            // 게시글의 좋아요 수 감소
            const updatedArticle = yield tx.article.update({
                where: { id },
                data: {
                    likeCount: { decrement: 1 },
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            nickname: true,
                        },
                    },
                },
            });
            return {
                deletedLike,
                article: Object.assign(Object.assign({}, updatedArticle), { isLiked: false, ownerId: updatedArticle.User.id, ownerNickname: updatedArticle.User.nickname, User: undefined }),
            };
        }));
        res.status(200).send({
            message: "좋아요가 취소되었습니다.",
            data: result.article,
        });
    }
    catch (error) {
        next(error);
    }
});
const service = {
    getArticleList,
    getArticle,
    createArticle,
    patchArticle,
    deleteArticle,
    createLike,
    deleteLike,
};
exports.default = service;
//# sourceMappingURL=service.js.map