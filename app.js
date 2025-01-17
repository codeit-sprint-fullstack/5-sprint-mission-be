import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('몽고디비 연결됨'))
    .catch(err => console.log(err));

app.post('/products', async (req, res) => {
  const { name, description, price, tags } = req.body;

  if (!name || !description || !price || !tags) {
    return res.status(400).send('잘못된 입력');
  }

  const newProduct = new Product({
    name: name,
    description: description,
    price: price,
    tags: tags
  });

  try {
    await newProduct.save();
    res.status(200).send('상품 등록 완료');
  } catch (err) {
    res.status(500).send('상품 등록 오류');
  }
});

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send('상품 없음');
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send('상품 조회 오류');
  }
});

app.patch('/products/:id', async (req, res) => {
  const id = req.params.id;
  const { name, description, price, tags } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send('상품 없음');
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.tags = tags || product.tags;

    await product.save();
    res.status(200).send('상품 수정 완료');
  } catch (err) {
    res.status(500).send('상품 수정 오류');
  }
});

app.delete('/products/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send('상품 없음');
    }
    res.status(200).send('상품 삭제 완료');
  } catch (err) {
    res.status(500).send('상품 삭제 오류');
  }
});

app.get('/products', async (req, res) => {
  const { offset, limit, recent, search } = req.query;

  let query = {};
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    };
  }

  try {
    const products = await Product.find(query)
        .skip(Number(offset || 0))
        .limit(Number(limit || 10))
        .sort(recent === 'true' ? { createdAt: -1 } : {});

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send('상품 조회 오류');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 실행 중... 포트: ${PORT}`);
});
