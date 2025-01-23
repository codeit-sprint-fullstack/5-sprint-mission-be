import commentService from "../service/comment.service.js";
import productService from "../../product/service/product.service.js";
import articleService from "../../article/service/article.service.js";

const fetchCommentList = async (req, res) => {
  const { resourceType, resourceId } = extractResource(req);
  const { cursor, limit = 10 } = req.query;

  if (!(await validateResource(resourceType, resourceId)))
    return res
      .status(400)
      .send({ message: "The specified Resource ID does not exist." });

  try {
    const commentList = await commentService.fetchCommentList(
      cursor,
      limit,
      resourceType,
      resourceId
    );
    const totalCount = await commentService.fetchCommentCount(
      resourceType,
      resourceId
    );
    res.status(200).send({ list: commentList, totalCount });
  } catch (err) {
    console.log(`Error API in GET '/comments' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const addComment = async (req, res) => {
  const { resourceType, resourceId } = extractResource(req);
  const { content } = req.body;

  if (!content || typeof content !== "string")
    return res
      .status(400)
      .send({ message: "Content is required and must be a string." });
  if (!(await validateResource(resourceType, resourceId)))
    return res
      .status(400)
      .send({ message: "The specified Resource ID does not exist." });

  try {
    const comment = await commentService.addComment(
      resourceType,
      resourceId,
      content
    );
    res.status(201).send(comment);
  } catch (err) {
    console.log(`Error API in POST '/comments' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const modifyComment = async (req, res) => {
  const { resourceType, resourceId } = extractResource(req);
  const { id, content } = req.body;

  if (!content || typeof content !== "string")
    return res
      .status(400)
      .send({ message: "Content is required and must be a string." });
  if (!(await validateResource(resourceType, resourceId)))
    return res
      .status(400)
      .send({ message: "The specified Resource ID does not exist." });

  try {
    if (!(await commentService.existComment(id)))
      return res.status(400).send({ message: "Invalid comment's id" });

    const comment = await commentService.modifyComment(id, content);
    res.status(201).send(comment);
  } catch (err) {
    console.log(`Error API in PATCH '/comments' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const removeComment = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await commentService.existComment(id)))
      return res.status(400).send({ message: "Invalid comment's id" });
    await commentService.removeComment(id);
    res.sendStatus(204);
  } catch (err) {
    console.log(
      `Error API in DELETE '/comments/${id}' | message::${err.message}`
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const extractResource = (req) => {
  const path = req.baseUrl; // 예: "/api/products" 또는 "/api/articles"
  let resourceType;
  let resourceId;

  if (path.includes("/products")) {
    resourceType = "product";
    resourceId = req.params.id;
  } else if (path.includes("/articles")) {
    resourceType = "article";
    resourceId = req.params.id;
  } else {
    throw new Error("Invalid resource type");
  }

  return { resourceType, resourceId };
};

const validateResource = async (resourceType, resourceId) => {
  let exist = false;

  try {
    if (resourceType === "product")
      exist = await productService.existProduct(resourceId);
    if (resourceType === "article")
      exist = await articleService.existArticle(resourceId);
  } catch (err) {
    throw new Error("product, article 확인할 때 에러");
  } finally {
    return exist;
  }
};

const commentController = {
  fetchCommentList,
  addComment,
  modifyComment,
  removeComment,
};

export default commentController;
