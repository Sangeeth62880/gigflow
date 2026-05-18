import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { asyncHandler } from '@/utils/asyncHandler';
import { validate } from '@/middleware/validate';
import { registerSchema, loginSchema } from '@/validators/authSchemas';
import { protect, restrictTo } from '@/middleware/auth';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(AuthController.register));
router.post('/login', validate(loginSchema), asyncHandler(AuthController.login));
router.get('/me', protect, asyncHandler(AuthController.getMe));
router.get('/users', protect, restrictTo('admin'), asyncHandler(AuthController.getUsers));

export default router;
