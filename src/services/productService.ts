import prisma from '../utils/prismaClient';

interface createProductService {
    title: string;
    description: string;
    price: string;
    tags?: string[];
}

interface getProductService {
    id: string;
}

interface getProductListService {
    page: string | undefined ;
    pageSize: string | undefined ;
    order: string | undefined ;
}

interface updateProductService {
    id: string;
    title: string;
    description: string;
    price: string;
    tags?: string[];
}

interface deleteProductService {
    id: string;
}

export const createProductService = ({title, description, price, tags}: createProductService) => {
    const numPrice = Number(price)
    const data: {
        title: string,
        description: string,
        price: number,
        tags?: string[],
    } = {title, description, price: numPrice}

    if (tags) data.tags = tags;

    return prisma.product.create({
        data: {
            ...data,
        },
    })
}

export const getProductService = ({id}: getProductService) => {
    return prisma.product.findUnique({
        where: {id: Number(id)}
    })
}

export const getProductListService = ({page, pageSize, order}: getProductListService) => {
    const currentPage = Number(page) || 1;
    const currentPageSize = Number(pageSize) || 10;
    const sort = order === 'desc' ? 'desc' : 'asc';

    const skip = (currentPage - 1) * currentPageSize;
    return prisma.product.findMany({
        skip,
        orderBy: {createdAt: sort},
        take: currentPageSize,
    })
}

export const updateProductService = ({id, title, description, price, tags}: updateProductService) => {
    const data: {
        title?: string;
        description?: string;
        price?: number;
        tags?: string[];
    } = {}

    if (title) data.title = title;
    if (description) data.description = description;
    if (price) data.price = Number(price);
    if (tags) data.tags = tags;

    return prisma.product.update({
        where: {id: Number(id)},
        data: data,
    })
}

export const deleteProductService = ({id}: deleteProductService) => {
    return prisma.product.delete({
        where: {id: Number(id)},
    })
}