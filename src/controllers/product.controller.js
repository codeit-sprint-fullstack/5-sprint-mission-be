import productService from '../services/product.service.js';

export const test = async (req, res) => {
    try {
        res.status(200).json({ message: "테스트 접속 성공"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(200).json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: '500에러', error: err });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: '500에러', error: err });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(400).json({ message: '게시글을 찾을 수 없음' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: '500에러', error: err });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(400).json({ message: '게시글을 찾을 수 없음' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: '500에러', error: err });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (product) {
            res.status(200).json({ message: '삭제 완료' });
        } else {
            res.status(400).json({ message: '게시글을 찾을 수 없음' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: '500에러', error: err });
    }
};
