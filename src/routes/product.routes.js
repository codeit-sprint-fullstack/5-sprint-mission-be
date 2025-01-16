import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

router.post('/items', createProduct);
router.get('/items', getProducts);
router.get('/items/:id', getProductById);
router.put('/items/:id', updateProduct);
router.delete('/items/:id', deleteProduct);

export default router;
