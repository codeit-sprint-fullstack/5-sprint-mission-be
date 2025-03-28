import { ApiSignature } from "../../../utils/apiResponse.interface";
import { CommentRequest } from "../interfaces/comment.interface";
import commentService from "../services/comment.service";

const createComment: ApiSignature = async (req, res) => {
  const data: CommentRequest = req.body;
  const authInfo = req.user;
  let resourceType = "";
  let resourceId = "";

  if (req.baseUrl.startsWith("/posts")) {
    resourceType = "POST";
    resourceId = req.params.postId;
  } else if (req.baseUrl.startsWith("/articles")) {
    resourceType = "ARTICLE";
    resourceId = req.params.articleId;
  }

  const comment = await commentService.createComment(
    data,
    authInfo!,
    resourceType,
    resourceId
  );

  res.status(201).send(comment);
};

const getCommentList: ApiSignature = async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  let resourceType = "";
  let resourceId = "";

  if (req.baseUrl.startsWith("/posts")) {
    resourceType = "POST";
    resourceId = req.params.postId;
  } else if (req.baseUrl.startsWith("/articles")) {
    resourceType = "ARTICLE";
    resourceId = req.params.articleId;
  }

  const comments = await commentService.getCommentList(
    limit,
    resourceType,
    resourceId
  );

  res.status(200).send(comments);
};

const patchComment: ApiSignature = async (req, res) => {
  const data: CommentRequest = req.body;
  const authInfo = req.user;
  let resourceType = "";
  let resourceId = "";

  if (req.baseUrl.startsWith("/posts")) {
    resourceType = "POST";
    resourceId = req.params.postId;
  } else if (req.baseUrl.startsWith("/articles")) {
    resourceType = "ARTICLE";
    resourceId = req.params.articleId;
  }

  const comment = await commentService.patchComment(
    resourceType,
    resourceId,
    data,
    authInfo!
  );

  res.status(200).send(comment);
};

const deleteComment: ApiSignature = async (req, res) => {
  const authInfo = req.user;
  let resourceType = "";
  let resourceId = "";

  if (req.baseUrl.startsWith("/posts")) {
    resourceType = "POST";
    resourceId = req.params.postId;
  } else if (req.baseUrl.startsWith("/articles")) {
    resourceType = "ARTICLE";
    resourceId = req.params.articleId;
  }

  await commentService.deleteComment(resourceType, resourceId, authInfo!);

  res.status(200).send({ id: resourceId });
};

const commentController = {
  createComment,
  getCommentList,
  patchComment,
  deleteComment,
};

export default commentController;
