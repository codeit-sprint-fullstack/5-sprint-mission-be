import { UnauthorizedException } from "@/exceptions/UnauthorizedExceptions";
import { ArticleWithAuthorAndIsLiked } from "@/models/article";
import likeService from "@/services/likeService";
import { DeleteController, PostController } from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import { likeParam } from "@/validators/likeValidator";

const postArticleLike: PostController<
  likeParam,
  Record<string, never>,
  SuccessResponse<ArticleWithAuthorAndIsLiked>
> = async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const result = await likeService.articlePostLike({
      articleId,
      userId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const deleteArticleLike: DeleteController<
  likeParam,
  Record<string, any>,
  SuccessResponse<null>
> = async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const result = await likeService.articleDeleteLike({
      articleId,
      userId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const likeController = {
  postArticleLike,
  deleteArticleLike,
}

export default likeController;