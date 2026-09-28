import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validate } from '../validators';
import { createUserSchema, updateUserSchema } from '../validators/authValidators';

const router = Router();

router.use(protect, authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;