import { BadRequestException } from "@/exceptions/BadRequestExceptions";
import { ForbiddenException } from "@/exceptions/ForbiddenExceptions";
import { UnauthorizedException } from "@/exceptions/UnauthorizedExceptions";
import { Article } from "@/generated/prisma";
import { ArticlesWithTotalCount } from "@/models/article";
import articleService from "@/services/articleService";
import {
  DeleteController,
  GetController,
  PatchController,
  PostController,
} from "@/types/controller";
import { SuccessResponse } from "@/types/response";
import {
  articleParam,
  getArticleListQuery,
  articlePostAndPatchBody,
} from "@/validators/articleValidator";
import { ParamsDictionary } from "express-serve-static-core";

const getArticleList: GetController<
  ParamsDictionary,
  getArticleListQuery,
  SuccessResponse<ArticlesWithTotalCount>
> = async (req, res, next) => {
  try {
    const { page = "1", pageSize = "10", keyword, orderBy } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);
    const result = await articleService.getArticleList({
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

const getArticleById: GetController<
  articleParam,
  Record<string, any>,
  SuccessResponse<Article>
> = async (req, res, next) => {
  try {
    const idNum = Number(req.params.id);
    const userId = req.session.userId;
    const result = await articleService.getArticleById(idNum, userId);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const postArticle: PostController<
  ParamsDictionary,
  articlePostAndPatchBody,
  SuccessResponse<Article>
> = async (req, res, next) => {
  try {
    const { title, content, img = [] } = req.body;
    const authorId = req.session.userId;
    if (!authorId) throw new UnauthorizedException();
    const result = await articleService.postArticle({
      title,
      content,
      img,
      authorId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const deleteArticle: DeleteController<
  articleParam,
  Record<string, any>,
  SuccessResponse<null>
> = async (req, res, next) => {
  try {
    const idNum = Number(req.params.id);
    const authorId = req.session.userId;
    const article = await articleService.getArticleById(idNum);
    if (!article) throw new BadRequestException("존재하지 않는 게시물입니다.");
    if (!authorId) throw new UnauthorizedException();
    if (authorId !== article.data.authorId) throw new ForbiddenException();
    const result = await articleService.deleteArticle(idNum);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const updateArticle: PatchController<
  articleParam,
  articlePostAndPatchBody,
  SuccessResponse<Article>
> = async (req, res, next) => {
  try {
    const idNum = Number(req.params.id);
    const authorId = req.session.userId;
    const article = await articleService.getArticleById(idNum);
    const { title, content, img = [] } = req.body;
    if (!article) throw new BadRequestException("존재하지 않는 게시물입니다.");
    if (!authorId) throw new UnauthorizedException();
    if (authorId !== article.data.authorId) throw new ForbiddenException();
    const result = await articleService.updateArticle(idNum, {
      title,
      content,
      img,
      authorId,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const articleController = {
  getArticleList,
  getArticleById,
  postArticle,
  deleteArticle,
  updateArticle,
};

export default articleController;
