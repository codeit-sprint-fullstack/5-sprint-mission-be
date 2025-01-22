import articleService from "../service/article.service.js";

const addArticle = async (req, res) => {
  const { title, content } = req.body;

  if (!title || typeof title !== "string")
    return res
      .status(400)
      .send({ message: "Title is required and must be a string." });
  if (!content || typeof content !== "string")
    return res
      .status(400)
      .send({ message: "Content is required and must be a string." });

  try {
    const article = await articleService.addArticle(title, content);
    res.status(201).send(article);
  } catch (err) {
    console.log(`Error API in POST '/articles' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const fetchArticle = async (req, res) => {
  const id = req.params.id;

  try {
    const article = await articleService.fetchArticle(id);
    if (!article)
      return res.status(400).send({ message: "Invalid article's id" });
    res.status(200).send(article);
  } catch (err) {
    console.log(`Error API in GET '/articles/${id}' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const modifyArticle = async (req, res) => {
  const { id, title, content } = req.body;

  if (!title || typeof title !== "string")
    return res
      .status(400)
      .send({ message: "Title is required and must be a string." });
  if (!content || typeof content !== "string")
    return res
      .status(400)
      .send({ message: "Content is required and must be a string." });

  try {
    if (!(await articleService.existArticle(id)))
      return res.status(400).send({ message: "Invalid article's id" });

    const article = await articleService.modifyArticle(id, title, content);
    res.status(201).send(article);
  } catch (err) {
    console.log(`Error API in PATCH '/articles' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const removeArticle = async (req, res) => {
  const id = req.params.id;

  try {
    if (!(await articleService.existArticle(id)))
      return res.status(400).send({ message: "Invalid article's id" });
    await articleService.removeArticle(id);
    res.sendStatus(204);
  } catch (err) {
    console.log(
      `Error API in DELETE '/articles/${id}' | message::${err.message}`
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const fetchArticleList = async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = req.body;

  try {
    const articleList = await articleService.fetchArticleList(
      page,
      pageSize,
      orderBy,
      keyword
    );
    const totalCount = await articleService.fetchArticleCount(keyword);
    res.status(200).send({ list: articleList, totalCount });
  } catch (err) {
    console.log(`Error API in GET '/articles' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const articleController = {
  fetchArticle,
  addArticle,
  modifyArticle,
  removeArticle,
  fetchArticleList,
};

export default articleController;
