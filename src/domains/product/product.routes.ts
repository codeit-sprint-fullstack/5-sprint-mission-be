import express from 'express'
import { requestHandler } from '../../utils/requestHandler';
import { productBaseValidationRules, productPaginationRules } from '../../middlewares/product.middleware';
import productController from './controllers/product.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { validateReq } from '../../middlewares/validator.middleware';
import favoriteController from '../favorite/controllers/favorite.controller';

const productRouter = express.Router();


productRouter.get('/', productPaginationRules, validateReq, requestHandler(productController.getProductList))

productRouter.use(authenticateJWT);
productRouter.post('/', productBaseValidationRules, validateReq, requestHandler(productController.createProduct));

productRouter.get('/:productId', requestHandler(productController.getProductDetail))
productRouter.patch('/:productId', productBaseValidationRules, validateReq, requestHandler(productController.patchProduct))
productRouter.delete('/:productId', requestHandler(productController.deleteProduct))

productRouter.post('/:productId/favorite', requestHandler(favoriteController.createProductFavorite));
productRouter.delete('/:productId/favorite', requestHandler(favoriteController.deleteProductFavorite));

export default productRouter;