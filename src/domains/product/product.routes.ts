import express from 'express'
import { requestHandler } from '../../utils/requestHandler';
import { productBaseValidationRules, productPaginationRules } from '../../middlewares/product.middleware';
import productController from './controllers/product.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { validateReq } from '../../middlewares/validator.middleware';
import favoriteRouter from '../favorite/favorite.routes';

const productRouter = express.Router();

productRouter.use(authenticateJWT);

productRouter.post('/', productBaseValidationRules, validateReq, requestHandler(productController.createProduct));
productRouter.get('/', productPaginationRules, validateReq, requestHandler(productController.getProductList))

productRouter.use('/:productId/favorite', favoriteRouter)

productRouter.get('/:productId', requestHandler(productController.getProductDetail))
productRouter.patch('/:productId', productBaseValidationRules, validateReq, requestHandler(productController.patchProduct))
productRouter.delete('/:productId', requestHandler(productController.deleteProduct))


export default productRouter;