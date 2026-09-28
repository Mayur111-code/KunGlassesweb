import { Router } from 'express';
import {
  getSettings,
  getSettingsAdmin,
  updateSettings,
  createContactMethod,
  updateContactMethod,
  setPrimaryContactMethod,
  deleteContactMethod,
} from '../controllers/settingsController';
import { protect, authorize } from '../middleware/authMiddleware';
import { buildLogMiddleware } from '../controllers/activityLogController';

const router = Router();

router.get('/public', getSettings);

router.use(protect);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), getSettingsAdmin);
router.put(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN'),
  buildLogMiddleware('UPDATE_SETTINGS', 'settings', () => 'site'),
  updateSettings
);

router.post(
  '/contact-methods',
  authorize('SUPER_ADMIN', 'ADMIN'),
  createContactMethod
);
router.put(
  '/contact-methods/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  updateContactMethod
);
router.patch(
  '/contact-methods/:id/primary',
  authorize('SUPER_ADMIN', 'ADMIN'),
  setPrimaryContactMethod
);
router.delete(
  '/contact-methods/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  deleteContactMethod
);

export default router;