import { Router } from 'express';
import {
  getServices,
  getServicesPublic,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validate } from '../validators';
import { serviceSchema, updateServiceSchema, serviceSlugSchema } from '../validators/serviceValidators';
import { buildLogMiddleware } from '../controllers/activityLogController';

const router = Router();

router.get('/public', getServicesPublic);
router.get('/slug/:slug', validate(serviceSlugSchema), getServiceBySlug);
router.get('/', getServices);

router.use(protect);
router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(serviceSchema),
  createService
);
router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(updateServiceSchema),
  buildLogMiddleware('UPDATE_SERVICE', 'service', (req) => req.body?.title),
  updateService
);
router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  buildLogMiddleware('DELETE_SERVICE', 'service', (req) => req.params?.id),
  deleteService
);

export default router;
