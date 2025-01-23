import {
    getProductListService,
    deleteProductService,
    updateProductService,
    getProductService,
    createProductService
} from "../services/productService";
import {NextFunction, Request, Response} from "express";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, tags } = req.body;
        const { price } = req.body;
        const numPrice = Number(price);
        const product = await createProductService({ title, description, numPrice, tags })
        res.status(200).json(product);
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product = await getProductService({ id })
        res.status(200).json(product);
    } catch (error) {
        next(error)
    }
}

export const getProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = String(req.query.page) || "1";
        const pageSize = String(req.query.pageSize) || "10";
        const order = String(req.query.order) || "desc";
        const product = await getProductListService({ page, pageSize, order })
        res.status(200).json(product);
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description, price, tags } = req.body;
        const numPrice = Number(price)
        const product = await updateProductService({ id, title, description, numPrice, tags })
        res.status(200).json(product);
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product = await deleteProductService({ id })
        res.status(200).json("삭제가 완료되었습니다.");
    } catch (error) {
        next(error)
    }
}