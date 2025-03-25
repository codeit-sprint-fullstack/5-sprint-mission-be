import { ApiSignature } from "../../../utils/apiResponse.interface";
import { PaginationQueryDto } from "../../../utils/query.dto";
import { ArticleListResponse, ArticleRequest } from "../interdaces/article.interface";
import articleService from "../services/article.service";

const getArticleList: ApiSignature = async (req, res) => {
  const data: PaginationQueryDto = {
    page: Number(req.query.page ?? 1),
    pageSize: Number(req.query.pageSize ?? 10),
    orderBy: String(req.query.orderBy ?? 'createdAt'),
    keyword: String(req.query.keyword ?? '')
  };

  const response: ArticleListResponse = await articleService.getArticleList(data);

  res.status(200).send(response);
}

const createArticle: ApiSignature = async (req, res) => {
  const data: ArticleRequest = req.body;
  const authInfo = req.user;

  const response = await articleService.createArticle(data, authInfo!);

  res.status(201).send(response);
}

const getArticleDetail: ApiSignature = async (req, res) => {
  const articleId: string = req.params.articleId;

  const response = await articleService.getArticleDetail(articleId);

  res.status(200).send(response);
}

const patchArticle: ApiSignature = async (req, res) => {
  const articleId: string = req.params.articleId;
  const data: ArticleRequest = req.body;
  const authInfo = req.user;

  const response = await articleService.patchArticle(articleId, data, authInfo!);

  res.status(200).send(response);
}

const deleteArticle: ApiSignature = async (req, res) => {
  const articleId: string = req.params.articleId;
  const authInfo = req.user;

  await articleService.deleteArticle(articleId, authInfo!);

  res.status(204).send();
}

const articleController = {
  getArticleList,
  createArticle,
  getArticleDetail,
  patchArticle,
  deleteArticle
}

export default articleController;