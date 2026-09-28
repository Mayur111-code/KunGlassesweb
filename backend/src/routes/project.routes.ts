import { Router } from 'express';
import {
  getProjects,
  getProjectsPublic,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validate } from '../validators';
import { projectSchema, updateProjectSchema, projectSlugSchema } from '../validators/projectValidators';
import { buildLogMiddleware } from '../controllers/activityLogController';

const router = Router();

router.get('/public', getProjectsPublic);
router.get('/slug/:slug', validate(projectSlugSchema), getProjectBySlug);
router.get('/', getProjects);

router.use(protect);
router.post(
  '/',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(projectSchema),
  createProject
);
router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'),
  validate(updateProjectSchema),
  buildLogMiddleware('UPDATE_PROJECT', 'project', (req) => req.body?.title),
  updateProject
);
router.delete(
  '/:id',
  authorize('SUPER_ADMIN', 'ADMIN'),
  buildLogMiddleware('DELETE_PROJECT', 'project', (req) => req.params?.id),
  deleteProject
);

export default router;
