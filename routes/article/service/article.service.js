import prisma from "../../../prismaClient.js";

const addArticle = async (data) => {
  try {
    return await prisma.articles.create({
      data,
    });
  } catch (err) {
    throw new Error(`- Database error while add article :: ${err.message}`);
  }
};

const fetchArticle = async (id) => {
  try {
    const res = await prisma.articles.findUnique({
      where: {
        id,
      },
    });
    return { ...res, nickname: "총명한판다" };
  } catch (err) {
    throw new Error(`- Database error while fetch article :: ${err.message}`);
  }
};

const modifyArticle = async (id, title, content, imageUrl) => {
  try {
    return await prisma.articles.update({
      data: { title, content, imageUrl },
      where: {
        id,
      },
    });
  } catch (err) {
    throw new Error(`- Database error while modify article :: ${err.message}`);
  }
};

const removeArticle = async (id) => {
  try {
    return await prisma.articles.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    throw new Error(`- Database error while remove article :: ${err.message}`);
  }
};

const existArticle = async (id) => {
  try {
    const article = await prisma.articles.findUnique({
      where: {
        id,
      },
    });
    return !!article;
  } catch (err) {
    throw new Error(`- Database error while exist article :: ${err.message}`);
  }
};

const fetchArticleList = async (page, pageSize, orderBy, keyword) => {
  const skip = (page - 1) * pageSize;
  const orderByOption =
    orderBy === "favorite" ? { likeCnt: "desc" } : { createdAt: "desc" };

  const articleList = await prisma.articles.findMany({
    skip,
    take: pageSize,
    where: {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ],
    },
    orderBy: orderByOption,
  });
  const articles = articleList.map((article) => ({
    ...article,
    nickname: "총명한판다",
  }));

  return articles;
};

const fetchArticleCount = async (keyword) => {
  return await prisma.articles.count({
    where: {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ],
    },
  });
};

const articleService = {
  fetchArticle,
  addArticle,
  modifyArticle,
  removeArticle,
  existArticle,
  fetchArticleList,
  fetchArticleCount,
};

export default articleService;
