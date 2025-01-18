import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

// 상품 등록 API
router.post('/', async (req, res) => {
    try {
        const { name, description, price, tags = [] } = req.body;
        if (!name || !description || !price) {
            return res.status(400).json({ error: 'name, description, price는 필수입니다.' });
        }
        const product = new Product({ name, description, price, tags });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: '상품 등록 중 오류 발생' });
    }
});

// 상품 상세 조회 API
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
        }
        const { _id, name, description, price, tags, createdAt } = product;
        res.status(200).json({ id: _id, name, description, price, tags, createdAt });
    } catch (error) {
        res.status(500).json({ error: '상품 조회 중 오류 발생' });
    }
});

// 상품 수정 API
router.patch('/:id', async (req, res) => {
    try {
        const { name, description, price, tags } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, tags },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: '상품 수정 중 오류 발생' });
    }
});

// 상품 삭제 API
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '상품 삭제 성공' });
    } catch (error) {
        res.status(500).json({ error: '상품 삭제 중 오류 발생' });
    }
});

// 상품 목록 조회 API
router.get('/', async (req, res) => {
    try {
        const { offset = 0, sort = 'recent', name, description } = req.query;

        const filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (description) filter.description = { $regex: description, $options: 'i' };

        const sortOption = sort === 'recent' ? { createdAt: -1 } : { updatedAt: -1 };

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(Number(offset))
            .limit(10)
            .select('_id name price createdAt');

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: '상품 목록 조회 중 오류 발생' });
    }
});

export default router;
