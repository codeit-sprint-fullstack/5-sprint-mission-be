import express from 'express'
import authRouter from './auth/auth.routes'
import productRouter from './product/product.routes';

const router = express();

router.use('/auth', authRouter)
router.use('/products', productRouter);

export default router;