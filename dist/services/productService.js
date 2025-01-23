"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductService = exports.updateProductService = exports.getProductListService = exports.getProductService = exports.createProductService = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const createProductService = ({ title, description, price, tags }) => {
    const data = { title, description };
    if (tags)
        data.tags = tags;
    return prismaClient_1.default.product.create({
        data: {
            ...data,
            price: Number(price)
        },
    });
};
exports.createProductService = createProductService;
const getProductService = ({ id }) => {
    return prismaClient_1.default.product.findUnique({
        where: { id: Number(id) }
    });
};
exports.getProductService = getProductService;
const getProductListService = ({ page, pageSize, order }) => {
    const currentPage = Number(page) || 1;
    const currentPageSize = Number(pageSize) || 10;
    const sort = order === 'desc' ? 'desc' : 'asc';
    const skip = (currentPage - 1) * currentPageSize;
    return prismaClient_1.default.product.findMany({
        skip,
        orderBy: { createdAt: sort },
        take: currentPageSize,
    });
};
exports.getProductListService = getProductListService;
const updateProductService = ({ id, title, description, price, tags }) => {
    const data = {};
    if (title)
        data.title = title;
    if (description)
        data.description = description;
    if (price)
        data.price = Number(price);
    if (tags)
        data.tags = tags;
    return prismaClient_1.default.product.update({
        where: { id: Number(id) },
        data: data,
    });
};
exports.updateProductService = updateProductService;
const deleteProductService = ({ id }) => {
    return prismaClient_1.default.product.delete({
        where: { id: Number(id) },
    });
};
exports.deleteProductService = deleteProductService;
