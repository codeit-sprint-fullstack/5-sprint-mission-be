import express from 'express'
import authController from './controllers/auth.controller';
import { signInValidationRules, signUpValidationRules, validateReq } from '../../middlewares/auth.middleware';
import { requestHandler } from '../../utils/requestHandler';

const router = express.Router();

router.post('/signUp', signUpValidationRules, validateReq, requestHandler(authController.signUp))
router.post('/signIn', signInValidationRules, validateReq, requestHandler(authController.signIn))
router.post('/refresh-token', requestHandler(authController.refresh))

export default router;