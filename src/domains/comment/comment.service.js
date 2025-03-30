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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCommentsForProduct = exports.getCommentsByUserId = exports.getCommentsByProductId = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * 댓글 생성
 * @param data 생성할 댓글 데이터
 * @returns 생성된 댓글 (사용자 정보 포함)
 */
const createComment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // 상품 존재 여부 확인
    const product = yield prisma.products.findUnique({
        where: { id: data.productId },
    });
    if (!product) {
        throw new Error("상품을 찾을 수 없습니다.");
    }
    // 사용자 존재 여부 확인
    const user = yield prisma.users.findUnique({
        where: { id: data.userId },
        select: {
            id: true,
            nickname: true,
            image: true,
        },
    });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    // 댓글 생성 - resourceId와 resourceType 명시적 설정
    const comment = yield prisma.comments.create({
        data: {
            content: data.content,
            userId: data.userId,
            resourceId: data.productId, // 상품 ID를 resourceId로 설정
            resourceType: "PRODUCT", // 리소스 타입을 "PRODUCT"로 설정
        },
    });
    // 댓글과 사용자 정보 결합
    return Object.assign(Object.assign({}, comment), { user: {
            id: user.id,
            nickname: user.nickname,
            image: user.image,
        } });
});
exports.createComment = createComment;
/**
 * 댓글 ID로 조회
 * @param commentId 댓글 ID
 * @returns 댓글 (사용자 정보 포함) 또는 null
 */
const getCommentById = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma.comments.findUnique({
        where: { id: commentId },
    });
    if (!comment) {
        return null;
    }
    // 사용자 정보 조회
    const user = yield prisma.users.findUnique({
        where: { id: comment.userId },
        select: {
            id: true,
            nickname: true,
            image: true,
        },
    });
    if (!user) {
        throw new Error("댓글 작성자 정보를 찾을 수 없습니다.");
    }
    // 댓글과 사용자 정보 결합
    return Object.assign(Object.assign({}, comment), { user: {
            id: user.id,
            nickname: user.nickname,
            image: user.image,
        } });
});
exports.getCommentById = getCommentById;
/**
 * 댓글 수정
 * @param commentId 수정할 댓글 ID
 * @param data 수정할 내용
 * @returns 수정된 댓글 (사용자 정보 포함)
 */
const updateComment = (commentId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedComment = yield prisma.comments.update({
        where: { id: commentId },
        data: {
            content: data.content,
            updatedAt: new Date(),
        },
    });
    // 사용자 정보 조회
    const user = yield prisma.users.findUnique({
        where: { id: updatedComment.userId },
        select: {
            id: true,
            nickname: true,
            image: true,
        },
    });
    if (!user) {
        throw new Error("댓글 작성자 정보를 찾을 수 없습니다.");
    }
    // 댓글과 사용자 정보 결합
    return Object.assign(Object.assign({}, updatedComment), { user: {
            id: user.id,
            nickname: user.nickname,
            image: user.image,
        } });
});
exports.updateComment = updateComment;
/**
 * 댓글 삭제
 * @param commentId 삭제할 댓글 ID
 * @returns 삭제 성공 여부
 */
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.comments.delete({
        where: { id: commentId },
    });
    return true;
});
exports.deleteComment = deleteComment;
/**
 * 상품별 댓글 조회 (페이징)
 * @param params 조회 파라미터 (상품ID, 페이지, 페이지 크기)
 * @returns 댓글 목록과 총 개수
 */
const getCommentsByProductId = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, page, pageSize } = params;
    console.log("서비스에서 받은 상품 ID:", productId); // 디버깅용 로그 추가
    if (!productId) {
        throw new Error("상품 ID가 필요합니다.");
    }
    // 상품 존재 여부 확인 - findUnique는 ID가 null이면 안됨
    const product = yield prisma.products.findUnique({
        where: { id: productId },
    });
    if (!product) {
        throw new Error("상품을 찾을 수 없습니다.");
    }
    // 페이지네이션을 위한 건너뛰기 계산
    const skip = (page - 1) * pageSize;
    // 댓글 목록 조회 (최신순) - resourceId와 resourceType으로 필터링
    const comments = yield prisma.comments.findMany({
        where: {
            resourceId: productId,
            resourceType: "PRODUCT",
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
    });
    // 댓글 작성자 ID 목록 추출
    const userIds = [...new Set(comments.map((comment) => comment.userId))];
    // 사용자 정보 일괄 조회 (N+1 문제 방지)
    const users = yield prisma.users.findMany({
        where: { id: { in: userIds } },
        select: {
            id: true,
            nickname: true,
            image: true,
        },
    });
    // 사용자 ID를 키로 하는 맵 생성
    const userMap = new Map(users.map((user) => [user.id, user]));
    // 댓글과 사용자 정보 결합
    const list = comments.map((comment) => (Object.assign(Object.assign({}, comment), { user: userMap.get(comment.userId) || {
            id: comment.userId,
            nickname: "알 수 없음",
            image: null,
        } })));
    // 총 댓글 수 조회
    const totalCount = yield prisma.comments.count({
        where: {
            resourceId: productId,
            resourceType: "PRODUCT",
        },
    });
    return { list, totalCount };
});
exports.getCommentsByProductId = getCommentsByProductId;
/**
 * 사용자가 작성한 댓글 조회 (페이징)
 * @param userId 사용자 ID
 * @param page 페이지 번호
 * @param pageSize 페이지 크기
 * @returns 댓글 목록과 총 개수
 */
const getCommentsByUserId = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, pageSize = 10) {
    // 사용자 존재 여부 확인
    const user = yield prisma.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            nickname: true,
            image: true,
        },
    });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    // 페이지네이션을 위한 건너뛰기 계산
    const skip = (page - 1) * pageSize;
    // 사용자의 댓글 목록 조회 (최신순)
    const comments = yield prisma.comments.findMany({
        where: {
            userId,
            resourceType: "PRODUCT", // 상품 댓글만 필터링
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
    });
    // 관련 상품 ID 목록 추출
    const productIds = [
        ...new Set(comments.map((comment) => comment.resourceId)),
    ];
    // 상품 정보 일괄 조회 (N+1 문제 방지)
    const products = yield prisma.products.findMany({
        where: { id: { in: productIds } },
        select: {
            id: true,
            name: true,
        },
    });
    // 상품 ID를 키로 하는 맵 생성
    const productMap = new Map(products.map((product) => [product.id, product]));
    // 댓글과 사용자, 상품 정보 결합
    const list = comments.map((comment) => (Object.assign(Object.assign({}, comment), { user: {
            id: user.id,
            nickname: user.nickname,
            image: user.image,
        }, product: productMap.get(comment.resourceId) || {
            id: comment.resourceId,
            name: "알 수 없는 상품",
        } })));
    // 총 댓글 수 조회
    const totalCount = yield prisma.comments.count({
        where: {
            userId,
            resourceType: "PRODUCT",
        },
    });
    // Omit product to match CommentWithUser interface
    const formattedList = list.map((_a) => {
        var { product } = _a, rest = __rest(_a, ["product"]);
        return rest;
    });
    return {
        list: formattedList,
        totalCount,
    };
});
exports.getCommentsByUserId = getCommentsByUserId;
/**
 * 특정 상품에 댓글이 있는지 확인
 * @param productId 상품 ID
 * @returns 댓글 존재 여부
 */
const hasCommentsForProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma.comments.count({
        where: {
            resourceId: productId,
            resourceType: "PRODUCT",
        },
    });
    return count > 0;
});
exports.hasCommentsForProduct = hasCommentsForProduct;
