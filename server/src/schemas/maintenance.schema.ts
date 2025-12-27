//for maintanance schema validation
import { z } from 'zod';

export const maintenanceTypeEnum = z.enum(['ROUTINE', 'REPAIR', 'INSPECTION', 'EMERGENCY']);

export const createMaintenanceLogSchema = z.object({
  body: z.object({
    equipmentId: z.string().uuid('Invalid equipment ID'),
    type: maintenanceTypeEnum,
    description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
    cost: z.number().positive('Cost must be positive').optional().nullable(),
    date: z.string().datetime('Invalid date format'),
  }),
});

export const maintenanceLogIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid maintenance log ID'),
  }),
});

export const equipmentMaintenanceSchema = z.object({
  params: z.object({
    equipmentId: z.string().uuid('Invalid equipment ID'),
  }),
});

export const maintenanceQuerySchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    type: maintenanceTypeEnum.optional(),
  }),
});

export type CreateMaintenanceLogInput = z.infer<typeof createMaintenanceLogSchema>['body'];
