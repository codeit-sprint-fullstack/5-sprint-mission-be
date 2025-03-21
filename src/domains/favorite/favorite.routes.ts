import { Router } from 'express';
import favoriteController from './controllers/favorite.controller';
import { requestHandler } from '../../utils/requestHandler';

const favoriteRouter = Router({ mergeParams: true });

favoriteRouter.post('/', requestHandler(favoriteController.createProductFavorite));
favoriteRouter.delete('/', requestHandler(favoriteController.deleteProductFavorite));

export default favoriteRouter;