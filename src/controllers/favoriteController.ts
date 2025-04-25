import { UnauthorizedException } from "@/exceptions/UnauthorizedExceptions";
import { ProductWithOwnerAndIsFavorite } from "@/models/product";
import favoriteService from "@/services/favoriteService";
import { DeleteController, PostController } from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import { favoriteParam } from "@/validators/favoriteValidator";

const postProductFavorite: PostController<
  favoriteParam,
  Record<string, never>,
  SuccessResponse<ProductWithOwnerAndIsFavorite>
> = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const result = await favoriteService.productPostFavorite({
      productId,
      userId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const deleteProductFavorite: DeleteController<
  favoriteParam,
  Record<string, any>,
  SuccessResponse<null>
> = async ( req , res , next ) => {
  try {
    const productId = Number(req.params.productId);
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const result = await favoriteService.productDeleteFavorite({
      productId,
      userId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

const favoriteController = {
  postProductFavorite,
  deleteProductFavorite,
}

export default favoriteController;