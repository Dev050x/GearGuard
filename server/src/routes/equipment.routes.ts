//equipement routes
import { Router } from 'express';
import {
  createEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  getUpcomingMaintenance,
} from '../controllers/equipment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  equipmentIdSchema,
  equipmentQuerySchema,
} from '../schemas/equipment.schema';

const equipmentRouter = Router();

equipmentRouter.use(authMiddleware);

equipmentRouter.post('/', validate(createEquipmentSchema), createEquipment);
equipmentRouter.get('/', validate(equipmentQuerySchema), getEquipment);
equipmentRouter.get('/upcoming', getUpcomingMaintenance);
equipmentRouter.get('/:id', validate(equipmentIdSchema), getEquipmentById);
equipmentRouter.put('/:id', validate(updateEquipmentSchema), updateEquipment);
equipmentRouter.delete('/:id', validate(equipmentIdSchema), deleteEquipment);

export default equipmentRouter;