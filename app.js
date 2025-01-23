import Product from "./models/Product.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import Article from "./models/Article.js";
import Comment from "./models/Comments.js";
dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",
  "https://db-1-45k6.onrender.com",
];
dotenv.config();
const { DATABASE_URL } = process.env;
const PORT = 8000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS 정책 위반"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL 연결 성공!"))
  .catch((err) => console.error("PostgreSQL 연결 실패:", err));

sequelize
  .sync({ alter: true })
  .then(() => console.log("데이터베이스 테이블 동기화 완료"))
  .catch((err) => console.error("테이블 동기화 중 오류 발생:", err));

app.get("/", (req, res) => res.send("API 동작"));

//상품등록 API
app.post("/api/products", async (req, res) => {
  const { name, description, price, tags } = req.body;
  if (!name || !description || !price || !tags) {
    return res.status(400).send("name, description, price, tags는 필수입니다.");
  }

  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      tags,
    });

    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ message: "상품 등록 실패", error });
  }
});

//상품조회
app.get("/api/products", async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  try {
    const whereClause = search
      ? {
          [Sequelize.Op.or]: [
            { name: { [Sequelize.Op.iLike]: `%${search}%` } },
            { description: { [Sequelize.Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const products = await Product.findAndCountAll({
      where: whereClause,
      order: [["id", "DESC"]],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    res.status(200).send({
      products: products.rows,
      total: products.count,
      page: parseInt(page),
      totalPages: Math.ceil(products.count / limit),
    });
  } catch (error) {
    res.status(500).send({ message: "상품을 불러오지 못했습니다.", error });
  }
});

//상품 수정
app.patch("/api/products/:id", async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!product)
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: "상품 수정 실패", error });
  }
});

//상품삭제
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    res.status(200).send({ message: "상품이 삭제되었습니다." });
  } catch (error) {
    res.status(500).send({ message: "상품 삭제 실패", error });
  }
});

//상품 목록 조회
app.get("/api/products", async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sort = "recent" } = req.query;

    const query = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
          ],
        }
      : {};

    const products = await Product.find(query)
      .sort(sort === "recent" ? { createdAt: -1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).send({ total, products });
  } catch (error) {
    res.status(500).send({ message: "상품 목록 조회 실패", error });
  }
});

//게시글 등록
app.post("/api/articles", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("title과 content는 필수입니다.");
  }

  try {
    const article = await Article.create({ title, content });
    res.status(201).send(article);
  } catch (error) {
    res.status(500).send({ message: "게시글 등록 실패", error });
  }
});

// 게시글 조회
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await Article.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).send(articles);
  } catch (error) {
    res.status(500).send({ message: "게시글 조회 실패", error });
  }
});

//게시글 수정
app.patch("/api/articles/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const article = await Article.update(updates, { where: { id } });
    if (!article)
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    res.status(200).send({ message: "게시글 수정 완료" });
  } catch (error) {
    res.status(500).send({ message: "게시글 수정 실패", error });
  }
});

//게시글 삭제
app.delete("/api/articles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Article.destroy({ where: { id } });
    if (!result)
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    res.status(200).send({ message: "게시글 삭제 완료" });
  } catch (error) {
    res.status(500).send({ message: "게시글 삭제 실패", error });
  }
});

//댓글 등록
app.post("/api/articles/:articleId/comments", async (req, res) => {
  const articleId = parseInt(req.params.articleId, 10);
  const { content } = req.body;

  try {
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }

    const comment = await Comment.create({
      content,
      articleId,
    });

    res.status(201).send(comment);
  } catch (error) {
    res.status(500).send({ message: "댓글 등록 실패", error });
  }
});

//댓글 조회
app.get("/api/articles/:articleId/comments", async (req, res) => {
  const articleId = parseInt(req.params.articleId, 10);

  try {
    const comments = await Comment.findAll({
      where: { articleId },
      order: [["createdAt", "DESC"]],
    });

    if (comments.length === 0) {
      return res.status(404).send({ message: "댓글이 없습니다." });
    }

    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ message: "댓글 조회 실패", error });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
