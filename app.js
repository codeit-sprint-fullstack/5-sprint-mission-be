import Product from "./models/Product.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const { DATABASE_URL } = process.env;
const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("MongoDB 연결 성공!!!!!"))
  .catch((err) => console.error("MongoDB 연결 오류 ㅠㅠ:", err));

// 기본 경로
app.get("/", (req, res) => res.send("API 동작"));

//상품등록 API
app.post("/api/products", async (req, res) => {
  const { name, description, price, tags } = req.body;
  if (!name || !description || !price || !tags) {
    return res.status(400).send("name, description, price, tags는 필수입니다.");
  }

  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = await Product.create({
      id: newId,
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
  const { page = 1, limit = 10 } = req.query;

  try {
    const products = await Product.find({})
      .sort({ id: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "상품을 불러오지 못했습니다.", error });
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
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "상품 수정 실패", error });
  }
});

//상품삭제
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    res.status(200).json({ message: "상품이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "상품 삭제 실패", error });
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

    res.status(200).json({ total, products });
  } catch (error) {
    res.status(500).json({ message: "상품 목록 조회 실패", error });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
