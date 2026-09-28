import { Router } from 'express';
import {
  submitEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  updateEnquiryStatus,
  addEnquiryNote,
  assignEnquiry,
  deleteEnquiry,
  getEnquiryStats,
} from '../controllers/enquiryController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validate } from '../validators';
import { enquirySchema, statusSchema, noteSchema } from '../validators/enquiryValidators';

const router = Router();

router.post('/', validate(enquirySchema), submitEnquiry);

router.use(protect);

router.get('/stats', authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), getEnquiryStats);
router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), getEnquiries);
router.get('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), getEnquiry);
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateEnquiry);
router.patch(
  '/:id/status',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(statusSchema),
  updateEnquiryStatus
);
router.post(
  '/:id/notes',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(noteSchema),
  addEnquiryNote
);
router.patch(
  '/:id/assign',
  authorize('SUPER_ADMIN', 'ADMIN'),
  assignEnquiry
);
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), deleteEnquiry);

export default router;