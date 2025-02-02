import Article from "../models/article.js";

/**
 * 게시글 목록을 조회합니다.
 */
export const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const articles = await Article.find(offset, limit, search);
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({
      message: "게시글 목록 조회에 실패했습니다",
      error: error.message,
    });
  }
};

/**
 * 특정 게시글을 조회합니다.
 */
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다" });
    }
    res.status(200).json(article);
  } catch (error) {
    res
      .status(500)
      .json({ message: "게시글 조회에 실패했습니다", error: error.message });
  }
};

/**
 * 새로운 게시글을 생성합니다.
 */
export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res
      .status(400)
      .json({ message: "게시글 생성에 실패했습니다", error: error.message });
  }
};

/**
 * 게시글을 수정합니다.
 */
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body);
    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다" });
    }
    res.status(200).json(article);
  } catch (error) {
    res
      .status(400)
      .json({ message: "게시글 수정에 실패했습니다", error: error.message });
  }
};

/**
 * 게시글을 삭제합니다.
 */
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다" });
    }
    res.status(200).json({ message: "게시글이 삭제되었습니다" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "게시글 삭제에 실패했습니다", error: error.message });
  }
};
