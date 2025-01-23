import prisma from '../utils/prismaClient';

interface createArticleService {
    title: string;
    content: string;
}

interface getArticleService {
    id: string;
}

interface updateArticleService {
    id: string;
    title?: string;
    content?: string;
}

interface deleteArticleService {
    id: string;
}

interface getArticleListService {
    page?: number;
    pageSize?: number;
}

export const createArticleService = async ({title, content}: createArticleService) => {
    return prisma.article.create({
        data: {title, content},
    })
}

export const getArticleService = async ({id}: getArticleService) => {
    return prisma.article.findUnique({
        where: {id: Number(id)},
    })
}

export const getArticleListService = async ({page, pageSize}: getArticleListService) => {
    const currentPage = Number(page) || 1;
    const currentPageSize = Number(pageSize) || 10;

    const skip = (currentPage - 1) * currentPageSize;

    return prisma.article.findMany({
        skip: skip || 0,
        orderBy: {createdAt: "desc"},
        take: currentPageSize,
    })
}

export const updateArticleService = async ({id, title, content}: updateArticleService) => {
    const data: { title?: string, content?: string } = {};

    if (title) data.title = title;
    if (content) data.content = content;

    return prisma.article.update({
        where: { id: Number(id) },
        data: data,
    });
}

export const deleteArticleService = async ({id}: deleteArticleService) => {
    return prisma.article.delete({
        where: {id: Number(id)},
    })
}