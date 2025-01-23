import prisma from '../utils/prismaClient';

interface createCommentService {
    articleId: string;
    content: string;
}

interface getCommentService {
    articleId: string;
}

interface updateCommentService {
    id: string;
    content: string;
}

interface deleteCommentService {
    id: string;
}

export const createCommentService = async ({articleId, content}: createCommentService) => {
    return prisma.comment.create({
        data: {
            content,
            Article: {connect: {id: Number(articleId)},}
        }
    })
}

export const getCommentService = async ({articleId}: getCommentService) => {
    return prisma.comment.findMany({
        where: {id: Number(articleId)},
    })
}

export const updateCommentService = async ({id, content}: updateCommentService) => {
    return prisma.comment.update({
        where: {id: Number(id)},
        data: {content},
    })
}

export const deleteCommentService = async ({id}: deleteCommentService) => {
    return prisma.comment.delete({
        where: {id: Number(id)},
    })
}