import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {Product} from "./models/Product.js";

dotenv.config({ path: "../.env" });

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('몽고디비 연결됨'))
    .catch(err => console.log(err));

const app = express()
app.use(express.json())
app.use(cors())

//상품등록
app.post('/', async (req, res) => {
    const { name, description, price, tags } = req.body;
    if (!name || !description || !price) res.status(400).json({ error: "비어있는 필수 항목이 있습니다."});

    const newProduct = new Product({
        name,
        description,
        price,
        tags
    })
    try {
        await newProduct.save()
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//상품조회
app.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.findById(id)
        if (!product) res.status(400).send("상품 없음")
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, description, price, tags } = req.body;

    try {
        const product = await Product.findById(id)
        if (!product) res.status(400).send("상품 없음")

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.tags = tags || product.tags;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Product.findByIdAndDelete(id);
        if (!result) res.status(400).send("상품 없음");
        res.status(200).json("삭제 완료")
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//이 코드는 챗지피티가 대신 짬 ㅎ.,,,,,
app.get('/', async (req, res) => {
    const { offset = 0, limit = 10, sort = 'createdAt', search = '' } = req.query;
    const searchQuery = search ? { name: new RegExp(search, 'i') } : {};

    try {
        // 상품 목록 조회
        const products = await Product.find(searchQuery)
            .sort({ [sort]: -1 })  // 최신순으로 정렬
            .skip(Number(offset))   // offset 방식으로 페이지네이션
            .limit(Number(limit))   // 페이지당 개수
            .select('name price createdAt');  // 반환할 필드만 선택

        // 응답 반환
        res.json({ products });
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`서버 시작됨 ${process.env.PORT}`);
})