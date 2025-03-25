import { ApiSignature } from "../../../utils/apiResponse.interface";
import { PaginationQueryDto } from "../../../utils/query.dto";
import { ProductListResponse, ProductRequest, ProductResponse } from "../interfaces/product.interface";
import productService from "../services/product.service";

const createProduct: ApiSignature = async (req, res) => {
  const data: ProductRequest = req.body;
  const authInfo = req.user;

  const product: ProductResponse = await productService.createProduct(data, authInfo!);

  res.status(201).send(product);
}

const getProductList: ApiSignature = async (req, res) => {
  const params: PaginationQueryDto = {
    page: Number(req.query.page ?? 1),
    pageSize: Number(req.query.pageSize ?? 10),
    orderBy: String(req.query.orderBy ?? 'createdAt'),
    keyword: String(req.query.keyword ?? '')
  };

  const response: ProductListResponse = await productService.getProductList(params);

  res.status(200).send(response);
}

const getProductDetail: ApiSignature = async (req, res) => {
  const productId = req.params.productId;
  const authInfo = req.user;

  const response: ProductResponse = await productService.getProductDetail(productId, authInfo!);

  res.status(200).send(response);
}

const patchProduct: ApiSignature = async (req, res) => {
  const productId = req.params.productId;
  const data: ProductRequest = req.body;
  const authInfo = req.user;

  const response: ProductResponse = await productService.patchProduct(productId, data, authInfo!);

  res.status(200).send(response);
}

const deleteProduct: ApiSignature = async (req, res) => {
  const productId = req.params.productId;
  const authInfo = req.user;

  const id = await productService.deleteProduct(productId, authInfo!);

  res.status(200).send({ id });
}

const productController = {
  createProduct,
  getProductList,
  getProductDetail,
  patchProduct,
  deleteProduct
}

export default productController