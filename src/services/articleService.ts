import prisma from '../utils/prismaClient';
import {
    createArticleServiceInterface,
    getArticleServiceInterface,
    getArticleListServiceInterface,
    updateArticleServiceInterface,
    deleteArticleServiceInterface
} from "../utils/interfaces";

export const createArticleService = async ({title, content}: createArticleServiceInterface) => {
    return prisma.article.create({
        data: {title, content},
    })
}

export const getArticleService = async ({id}: getArticleServiceInterface) => {
    return prisma.article.findUnique({
        where: {id: Number(id)},
    })
}

export const getArticleListService = async ({page, pageSize}: getArticleListServiceInterface) => {
    const currentPage = Number(page) || 1;
    const currentPageSize = Number(pageSize) || 10;

    const skip = (currentPage - 1) * currentPageSize;

    return prisma.article.findMany({
        skip: skip || 0,
        orderBy: {createdAt: "desc"},
        take: currentPageSize,
    })
}

export const updateArticleService = async ({id, title, content}: updateArticleServiceInterface) => {
    const data: { title?: string, content?: string } = {};

    if (title) data.title = title;
    if (content) data.content = content;

    return prisma.article.update({
        where: {id: Number(id)},
        data: data,
    });
}

export const deleteArticleService = async ({id}: deleteArticleServiceInterface) => {
    return prisma.article.delete({
        where: {id: Number(id)},
    })
}