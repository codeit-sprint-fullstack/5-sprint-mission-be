import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getArticles = async (req, res) => {
  const { page = 1, pageSize = 10, search = "", sort = "recent" } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const orderBy = sort === "recent" ? { createdAt: "desc" } : undefined;

  try {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: String(search) } },
          { content: { contains: String(search) } },
        ],
      },
      orderBy,
      skip,
      take,
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.status(200).send(articles);
  } catch (error) {
    res.status(500).json({ error: "게시글 목록 조회 실패" });
  }
};

export const getArticleById = async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id },
  });
  res.send(article);
};

export const createArticle = async (req, res) => {
  const article = await prisma.article.create({
    data: req.body,
  });
  res.status(201).send(article);
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.update({
    where: { id },
    data: req.body,
  });
  res.send(article);
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.delete({
    where: { id },
  });
  res.sendStatus(204);
};

//[게시판]
// //특정 게시글에 댓글 생성
export const createComment = async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;
  try {
    const newComment = await prisma.article_Comment.create({
      data: {
        content,
        articleId: articleId,
      },
    });
    res.status(201).send(newComment);
  } catch (error) {
    res.status(500).json({ error: "댓글 생성 실패" });
  }
};

// 특정 articleId에 달린 댓글 목록 검색 (커서 기반 페이지네이션)
export const getCommentsByArticleId = async (req, res) => {
  const { articleId } = req.params;
  console.log(`Requesting comments for articleId: ${articleId}`);
  const { cursor, take = 10 } = req.query;

  try {
    const comments = await prisma.article_Comment.findMany({
      where: { articleId: articleId },
      orderBy: { createdAt: "asc" },
      take: Number(take),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      select: { id: true, content: true, createdAt: true },
    });
    if (!comments) {
      return res.status(404).json({ error: "댓글을 찾을 수 없음" });
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "게시글 댓글 목록 조회 실패 " });
  }
};

//게시판글 특정 게시글의 특정 댓글 조회
export const getCommentById = async (req, res) => {
  const { articleId, commentId } = req.params;
  console.log(
    `Requesting comment articleId: ${articleId}, commentId: ${commentId}`
  );
  try {
    const comments = await prisma.article_Comment.findMany({
      where: { articleId: articleId },
    });
    console.log(comments);
    const comment = comments.find((c) => c.id === commentId);
    console.log(`${commentId}`);
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없음" });
    }
    res.status(200).send(comment);
  } catch (error) {
    res.status(500).json({ error: "댓글 검색 실패" });
  }
};

//특정 댓글 수정
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const comment = await prisma.article_Comment.findUnique({
      where: {
        id: commentId,
      },
    });
    console.log(comment);

    const updatedComment = await prisma.article_Comment.update({
      where: { id: commentId },
      data: { content },
    });
    res.status(200).send(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "댓글 수정 실패" });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await prisma.article_Comment.findUnique({
      where: {
        id: commentId,
      },
    });
    console.log(comment);
    await prisma.article_Comment.delete({
      where: { id: commentId },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "댓글 삭제 실패" });
  }
};

export const articleFunctions = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

export const commentFunctions = {
  getCommentsByArticleId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
