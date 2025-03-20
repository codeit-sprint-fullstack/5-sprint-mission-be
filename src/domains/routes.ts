import express from 'express'
import authRouter from './auth/auth.routes'

const router = express();

router.use('/auth', authRouter)

export default router;