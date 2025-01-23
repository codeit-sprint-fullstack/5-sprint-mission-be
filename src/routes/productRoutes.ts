import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductList,
} from "../controllers/productController";

const router = express.Router()

router.post('/', createProduct);
router.get('/:id', getProduct);
router.get('/',getProductList);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;