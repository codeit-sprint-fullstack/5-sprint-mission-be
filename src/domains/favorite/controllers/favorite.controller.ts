import { ApiSignature } from "../../../utils/apiResponse.interface";
import { ProductResponse } from "../../product/interfaces/product.interface";
import favoriteService from "../services/favorite.service";

const createProductFavorite: ApiSignature = async (req, res) => {
  const productId = req.params.productId;
  const authInfo = req.user;

  const response: ProductResponse = await favoriteService.createProductFavorite('PRODUCT', productId, authInfo!);

  res.status(200).send(response);
}

const deleteProductFavorite: ApiSignature = async (req, res) => {
  const productId = req.params.productId;
  const authInfo = req.user;

  const response: ProductResponse = await favoriteService.deleteProductFavorite('PRODUCT', productId, authInfo!);

  res.status(200).send(response);
}

const createArticleFavorite: ApiSignature = async (req, res) => {
  const articleId = req.params.articleId;
  const authInfo = req.user;

  const response = await favoriteService.createArticleFavorite('ARTICLE', articleId, authInfo!);

  res.status(200).send(response);
}

const deleteArticleFavorite: ApiSignature = async (req, res) => {
  const articleId = req.params.articleId;
  const authInfo = req.user;

  const response = await favoriteService.deleteArticleFavorite('ARTICLE', articleId, authInfo!);

  res.status(200).send(response);
}

const favoriteController = {
  createProductFavorite,
  deleteProductFavorite,
  createArticleFavorite,
  deleteArticleFavorite
}

export default favoriteController;