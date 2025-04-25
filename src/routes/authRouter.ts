import authController from "@/controllers/authController";
import { validate } from "@/middleware/validate";
import { userCreateSchema, userLoginSchema } from "@/validators/userValidator";
import { Router } from "express";

const router = Router();
router.post('/signup', validate({body: userCreateSchema}), authController.createUser);
router.post('/signin', validate({body: userLoginSchema}), authController.loginUser)
export default router;