import prisma from '../utils/prismaClient';
import {Prisma} from "@prisma/client";

interface createCommentService {
    productId: string;
    content: string;
}

interface getCommentService {
    productId: string;
    cursor?: string;
    isDesc?: boolean;
    takeCount?: string;
}

interface updateCommentService {
    id: string;
    content: string;
}

interface deleteCommentService {
    id: string;
}

export const createCommentService = async ({productId, content}: createCommentService) => {
    return prisma.productComment.create({
        data: {
            content,
            Product: {connect: {id: Number(productId)},}
        }
    })
}

export const getCommentService = async ({productId, cursor, isDesc, takeCount}: getCommentService) => {
    const take = Number(takeCount) || 10;
    const where = {productId: Number(productId)}
    const order = isDesc ? 'desc' : 'asc';
    const query = cursor
        ? {skip: 1, cursor: {id: Number(cursor)}}
        : {skip: 0}
    return prisma.productComment.findMany({
        where,
        take,
        ...query,
        orderBy: {createdAt: order}
    } as Prisma.ProductCommentFindManyArgs)
}

export const updateCommentService = async ({id, content}: updateCommentService) => {
    return prisma.productComment.update({
        where: {id: Number(id)},
        data: {content},
    })
}

export const deleteCommentService = async ({id}: deleteCommentService) => {
    return prisma.productComment.delete({
        where: {id: Number(id)},
    })
}