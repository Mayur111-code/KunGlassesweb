import { Router } from 'express';
import { login, logout, me, changePassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../validators';
import { loginSchema, changePasswordSchema } from '../validators/authValidators';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.post('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;