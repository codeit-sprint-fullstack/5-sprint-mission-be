import prisma from '../utils/prismaClient';
import {Prisma} from "@prisma/client";
import {
    createCommentServiceInterface, deleteCommentServiceInterface,
    getCommentServiceInterface,
    updateCommentServiceInterface
} from "../utils/interfaces";


export const createCommentService = async ({productId, content}: createCommentServiceInterface) => {
    return prisma.productComment.create({
        data: {
            content,
            Product: {connect: {id: Number(productId)},}
        }
    })
}

export const getCommentService = async ({productId, cursor, isDesc, takeCount}: getCommentServiceInterface) => {
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

export const updateCommentService = async ({id, content}: updateCommentServiceInterface) => {
    return prisma.productComment.update({
        where: {id: Number(id)},
        data: {content},
    })
}

export const deleteCommentService = async ({id}: deleteCommentServiceInterface) => {
    return prisma.productComment.delete({
        where: {id: Number(id)},
    })
}