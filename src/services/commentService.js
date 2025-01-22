import prisma from '../lib/prismaClient.js';

export const createCommentService = async ({ articleId, content }) => {
    return prisma.comment.create({
        data: {
            content,
            article: { connect: { id: parseInt(articleId) } },
        },
    });
};

export const getCommentsService = async ({ articleId, cursor }) => {
    const take = 10;
    const where = { articleId: parseInt(articleId) };
    const query = cursor
        ? { skip: 1, cursor: { id: parseInt(cursor) } }
        : {};

    return prisma.comment.findMany({
        where,
        take,
        ...query,
        orderBy: { createdAt: 'desc' },
    });
};

export const updateCommentService = async ({ id, content }) => {
    return prisma.comment.update({
        where: { id: parseInt(id) },
        data: { content },
    });
};

export const deleteCommentService = async ({ id }) => {
    return prisma.comment.delete({
        where: { id: parseInt(id) },
    });
};
