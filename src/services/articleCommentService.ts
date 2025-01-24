import prisma from '../utils/prismaClient';
import {Prisma} from "@prisma/client";
import {
    createArticleCommentService,
    deleteArticleCommentService,
    GetArticleCommentService,
    updateArticleCommentService
} from "../utils/interfaces";

export const createCommentService = async ({articleId, content}: createArticleCommentService) => {
    return prisma.articleComment.create({
        data: {
            content,
            Article: {connect: {id: Number(articleId)},}
        }
    })
}


export const getCommentService = async ({articleId, cursor, isDesc, takeCount}: GetArticleCommentService) => {
    const take = Number(takeCount) || 10;
    const where = {articleId: Number(articleId)}
    const order = isDesc ? 'desc' : 'asc';
    const query = cursor
        ? {skip: 1, cursor: {id: Number(cursor)}}
        : {skip: 0}
    return prisma.articleComment.findMany({
        where,
        take,
        ...query,
        orderBy: {createdAt: order}
    } as Prisma.ArticleCommentFindManyArgs)
}


export const updateCommentService = async ({id, content}: updateArticleCommentService) => {
    return prisma.articleComment.update({
        where: {id: Number(id)},
        data: {content},
    })
}

export const deleteCommentService = async ({id}: deleteArticleCommentService) => {
    return prisma.articleComment.delete({
        where: {id: Number(id)},
    })
}