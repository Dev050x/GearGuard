//for equipment schema validation
import { z } from 'zod';

export const equipmentStatusEnum = z.enum(['GOOD', 'WARNING', 'CRITICAL', 'MAINTENANCE']);

export const createEquipmentSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
    category: z.string().min(1, 'Category is required').max(100, 'Category is too long'),
    purchaseDate: z.string().datetime().optional().nullable(),
    nextMaintenance: z.string().datetime().optional().nullable(),
    status: equipmentStatusEnum.optional().default('GOOD'),
    notes: z.string().max(1000, 'Notes are too long').optional().nullable(),
  }),
});

export const updateEquipmentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    category: z.string().min(1).max(100).optional(),
    purchaseDate: z.string().datetime().optional().nullable(),
    lastMaintenance: z.string().datetime().optional().nullable(),
    nextMaintenance: z.string().datetime().optional().nullable(),
    status: equipmentStatusEnum.optional(),
    notes: z.string().max(1000).optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid equipment ID'),
  }),
});

export const equipmentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid equipment ID'),
  }),
});

export const equipmentQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    status: equipmentStatusEnum.optional(),
  }),
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>['body'];
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>['body'];