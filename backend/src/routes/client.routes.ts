import { Router } from 'express';
import {
  getClients,
  getClientsPublic,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validate } from '../validators';
import { clientSchema, updateClientSchema } from '../validators/clientValidators';
import { buildLogMiddleware } from '../controllers/activityLogController';

const router = Router();

router.get('/public', getClientsPublic);
router.get('/', getClients);

router.use(protect);
router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(clientSchema),
  createClient
);
router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(updateClientSchema),
  buildLogMiddleware('UPDATE_CLIENT', 'client', (req) => req.body?.name),
  updateClient
);
router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  buildLogMiddleware('DELETE_CLIENT', 'client', (req) => req.params?.id),
  deleteClient
);

export default router;
