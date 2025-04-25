import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { ForbiddenException } from "@/exceptions/ForbiddenExceptions";
import { UnauthorizedException } from "@/exceptions/UnauthorizedExceptions";
import { Product } from "@/generated/prisma";
import { ProductWithTotalCount } from "@/models/product";
import productService from "@/services/productService";
import {
  DeleteController,
  GetController,
  PatchController,
  PostController,
} from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import {
  getProductListQuery,
  productParam,
  productPostAndPatchBody,
} from "@/validators/productValidator";
import { ParamsDictionary } from "express-serve-static-core";

const getProductList: GetController<
  ParamsDictionary,
  getProductListQuery,
  SuccessResponse<ProductWithTotalCount>
> = async (req, res, next) => {
  try {
    const {
      page = "1",
      pageSize = "10",
      keyword = "",
      orderBy = "recent",
    } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);
    const result = await productService.getProductList({
      page: pageNum,
      pageSize: pageSizeNum,
      keyword,
      orderBy,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const getProductById: GetController<
  productParam,
  Record<string, any>,
  SuccessResponse<Product>
> = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const idNum = Number(req.params.id);
    if (!userId) throw new UnauthorizedException();
    const result = await productService.getProductById(idNum, userId);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const postProduct: PostController<
  ParamsDictionary,
  productPostAndPatchBody,
  SuccessResponse<Product>
> = async (req, res, next) => {
  try {
    const ownerId = req.session.userId;
    if (!ownerId) throw new UnauthorizedException();
    const { name, description, images = [], tags = [], price } = req.body;
    const result = await productService.postProduct({
      name,
      description,
      images,
      tags,
      price: Number(price),
      ownerId,
    });
    res.status(200).send(result);
  } catch (err) {}
};

const updateProduct: PatchController<
  productParam,
  productPostAndPatchBody,
  SuccessResponse<Product>
> = async (req, res, next) => {
  try {
    const idNum = Number(req.params.id);
    const ownerId = req.session.userId;
    const product = await productService.getProductById(idNum);
    const { name, description, images = [], tags = [], price } = req.body;
    if (!product) throw new BadRequestException("존재하지 않는 상품입니다.");
    if (!ownerId) throw new UnauthorizedException();
    if (product.data.ownerId !== ownerId) throw new ForbiddenException();
    const result = await productService.patchProduct(idNum, {
      name,
      description,
      images,
      tags,
      price: Number(price),
      ownerId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const deleteProduct: DeleteController<
  productParam,
  Record<string, any>,
  SuccessResponse<null>
> = async (req, res, next) => {
  try {
    const idNum = Number(req.params.id);
    const ownerId = req.session.userId;
    const product = await productService.getProductById(idNum);
    if (!product) throw new BadRequestException("존재하지 않는 상품입니다.");
    if (!ownerId) throw new UnauthorizedException();
    if (ownerId !== product.data.ownerId) throw new ForbiddenException();
    const result = await productService.deleteProduct(idNum);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const productController = {
  getProductList,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
};

export default productController;
