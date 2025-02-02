import Comment from "../models/comment.js";

/**
 * 댓글 목록을 조회합니다.
 */
export const getComments = async (req, res) => {
  try {
    const { articleId, productId, cursor } = req.query;
    const limit = parseInt(req.query.limit) || 10;

    const comments = await Comment.find({
      articleId: articleId ? parseInt(articleId) : null,
      productId: productId ? parseInt(productId) : null,
      cursor: cursor ? parseInt(cursor) : null,
      limit,
    });

    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "댓글 목록 조회에 실패했습니다", error: error.message });
  }
};

/**
 * 새로운 댓글을 생성합니다.
 */
export const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      articleId: req.body.articleId ? parseInt(req.body.articleId) : null,
      productId: req.body.productId ? parseInt(req.body.productId) : null,
    });
    res.status(201).json(comment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "댓글 생성에 실패했습니다", error: error.message });
  }
};

/**
 * 댓글을 수정합니다.
 */
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res
      .status(400)
      .json({ message: "댓글 수정에 실패했습니다", error: error.message });
  }
};

/**
 * 댓글을 삭제합니다.
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다" });
    }
    res.status(200).json({ message: "댓글이 삭제되었습니다" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "댓글 삭제에 실패했습니다", error: error.message });
  }
};
