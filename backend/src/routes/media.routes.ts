import { Router } from 'express';
import { uploadMedia, createExternalMedia, getMedia, deleteMedia } from '../controllers/mediaController';
import { protect, authorize } from '../middleware/authMiddleware';
import { buildLogMiddleware } from '../controllers/activityLogController';

const router = Router();

router.use(protect);

router.post(
  '/upload',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  buildLogMiddleware('UPLOAD_MEDIA', 'media', (req) => req.params?.id),
  uploadMedia
);
router.post('/external', authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createExternalMedia);
router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), getMedia);
router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  deleteMedia
);

export default router;
