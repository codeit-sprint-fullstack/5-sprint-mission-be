import prisma from '../lib/prismaClient.js';

export const createArticleService = async ({ title, content }) => {
    return prisma.article.create({
        data: { title, content },
    });
};

export const getArticlesService = async ({ page = 1, pageSize = 10 }) => {
    const skip = (page - 1) * pageSize;
    return prisma.article.findMany({
        skip,
        take: parseInt(pageSize),
        orderBy: { createdAt: 'desc' },
    });
};
