import { Router } from 'express';
import { getActivityLogs } from '../controllers/activityLogController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(protect, authorize('SUPER_ADMIN', 'ADMIN'));
router.get('/', getActivityLogs);

export default router;