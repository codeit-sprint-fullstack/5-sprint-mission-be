import express from 'express'
import authRouter from './auth/auth.routes'
import productRouter from './product/product.routes';
import articleRouter from './article/article.routes';

const router = express();

router.use('/auth', authRouter)
router.use('/products', productRouter);
router.use('/articles/', articleRouter)

export default router;