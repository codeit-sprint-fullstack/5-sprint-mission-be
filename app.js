import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// 게시글 생성
app.post("/articles", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "제목 혹은 내용이 누락되었습니다." });
  }

  try {
    const articles = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(articles);
  } catch (error) {
    res.status(500).json({ error: "게시글 생성에 실패했습니다." });
  }
});

// 특정 게시글 조회
app.get("/article/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: "게시글 조회에 실패했습니다." });
  }
});

// 게시글 수정
app.patch("/article/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // 제목 혹은 내용이 한개라도 있어야 함.
  if (!title && !content) {
    return res
      .status(400)
      .json({ error: "수정 될 제목이나 내용이 있어야 합니다." });
  }

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const updatedArticle = await prisma.article.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: "게시글 수정에 실패했습니다." });
  }
});

// 게시글 삭제
app.delete("/article/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!article) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    await prisma.article.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "게시글 삭제에 실패했습니다." });
  }
});

// 게시글 목록 조회
app.get("/articles", async (req, res) => {
  try {
    let { page = 1, limit = 10, search, sort } = req.query;
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;
    const searchFilter = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const orderBy =
      sort === "recent"
        ? {
            createdAt: "desc",
          }
        : { id: "asc" };

    const articles = await prisma.article.findMany({
      where: searchFilter,
      orderBy: orderBy,
      skip,
      take: limit,
      orderBy: orderBy,
    });

    const totalArticles = await prisma.article.count({
      where: searchFilter,
    });

    res.status(200).json({ articles, totalCount: totalArticles });
  } catch (error) {
    res.status(500).json({ error: "게시글 목록 조회에 실패했습니다." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
