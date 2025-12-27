//maintenance routes
import { Router } from 'express';
import {
  createMaintenanceLog,
  getMaintenanceLogs,
  getMaintenanceLogsByEquipment,
  deleteMaintenanceLog,
} from '../controllers/maintenance.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createMaintenanceLogSchema,
  maintenanceLogIdSchema,
  equipmentMaintenanceSchema,
  maintenanceQuerySchema,
} from '../schemas/maintenance.schema';

const maintenanceRouter = Router();

maintenanceRouter.use(authMiddleware);

maintenanceRouter.post('/', validate(createMaintenanceLogSchema), createMaintenanceLog);
maintenanceRouter.get('/', validate(maintenanceQuerySchema), getMaintenanceLogs);
maintenanceRouter.get('/equipment/:equipmentId', validate(equipmentMaintenanceSchema), getMaintenanceLogsByEquipment);
maintenanceRouter.delete('/:id', validate(maintenanceLogIdSchema), deleteMaintenanceLog);

export default maintenanceRouter;