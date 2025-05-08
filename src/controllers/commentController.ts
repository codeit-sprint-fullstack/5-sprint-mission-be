import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { UnauthorizedException } from "@/exceptions/UnauthorizedExceptions";
import { Comment } from "@prisma/client";
import { commentResponseWithNextCursor } from "@/models/comment";
import articleService from "@/services/articleService";
import commentService from "@/services/commentService";
import productService from "@/services/productService";
import {
  DeleteController,
  GetController,
  PatchController,
  PostController,
} from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import {
  commentBody,
  commentParam,
  commentQuery,
} from "@/validators/commentValidator";

const getProductCommentList: GetController<
  commentParam,
  commentQuery,
  commentResponseWithNextCursor
> = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId) throw new BadRequestException("상품 ID를 입력해주세요.");
    const product = await productService.getProductById(productId);
    if (!product) throw new BadRequestException("존재하지 않는 상품입니다.");
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const { pageSize = "5", cursor } = req.query;
    const result = await commentService.getProductCommentList({
      productId,
      pageSize: Number(pageSize),
      cursor: Number(cursor),
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const getArticleCommentList: GetController<
  commentParam,
  commentQuery,
  commentResponseWithNextCursor
> = async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    if (!articleId) throw new BadRequestException("게시글 ID를 입력해주세요.");
    const article = await articleService.getArticleById(articleId);
    if (!article) throw new BadRequestException("존재하지 않는 상품입니다.");
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const { pageSize = "5", cursor } = req.query;
    const result = await commentService.getArticleCommentList({
      articleId,
      pageSize: Number(pageSize),
      cursor: Number(cursor),
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const postProductComment: PostController<
  commentParam,
  commentBody,
  SuccessResponse<Comment>
> = async (req, res, next) => {
  try {
    const authorId = req.session.userId;
    if (!authorId) throw new UnauthorizedException();
    const productId = Number(req.params.productId);
    const content = req.body.content;
    const result = await commentService.postProductComment({
      authorId,
      productId,
      content,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const postArticleComment: PostController<
  commentParam,
  commentBody,
  SuccessResponse<Comment>
> = async (req, res, next) => {
  try {
    const authorId = req.session.userId;
    if (!authorId) throw new UnauthorizedException();
    const articleId = Number(req.params.articleId);
    const content = req.body.content;
    const result = await commentService.postArticleComment({
      authorId,
      articleId,
      content,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const patchComment: PatchController<
  commentParam,
  commentBody,
  SuccessResponse<Comment>
> = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const id = Number(req.params.id);
    const content = req.body.content;
    const result = await commentService.updateComment({
      id,
      content,
      authorId: userId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const deleteComment: DeleteController<
  commentParam,
  Record<string, any>,
  SuccessResponse<null>
> = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) throw new UnauthorizedException();
    const id = Number(req.params.id);
    const result = await commentService.deleteComment({ id, authorId: userId });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const commentController = {
  getProductCommentList,
  getArticleCommentList,
  postProductComment,
  postArticleComment,
  patchComment,
  deleteComment,
};

export default commentController;
