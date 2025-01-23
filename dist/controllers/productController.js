"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductList = exports.getProduct = exports.createProduct = void 0;
const productService_1 = require("../services/productService");
const createProduct = async (req, res, next) => {
    try {
        const { title, description, price, tags } = req.body;
        const product = await (0, productService_1.createProductService)({ title, description, price, tags });
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await (0, productService_1.getProductService)({ id });
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.getProduct = getProduct;
const getProductList = async (req, res, next) => {
    try {
        const page = String(req.query.page) || "1";
        const pageSize = String(req.query.pageSize) || "10";
        const order = String(req.query.order) || "desc";
        const product = await (0, productService_1.getProductListService)({ page, pageSize, order });
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.getProductList = getProductList;
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, price, tags } = req.body;
        const product = await (0, productService_1.updateProductService)({ id, title, description, price, tags });
        res.status(200).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await (0, productService_1.deleteProductService)({ id });
        res.status(200).json("삭제가 완료되었습니다.");
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
