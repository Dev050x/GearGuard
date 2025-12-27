//maintenance controller 
import { Response } from 'express';
import { PrismaClient, MaintenanceType  } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateMaintenanceLogInput } from '../schemas/maintenance.schema';

const prisma = new PrismaClient();

export const createMaintenanceLog = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId, type, description, cost, date } = req.body as CreateMaintenanceLogInput;

    const equipment = await prisma.equipment.findFirst({
      where: {
        id: equipmentId,
        userId: req.userId!,
      },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        equipmentId,
        type: type as MaintenanceType,
        description,
        cost: cost || null,
        date: new Date(date),
      },
    });

    // Update equipment lastMaintenance
    await prisma.equipment.update({
      where: { id: equipmentId },
      data: { lastMaintenance: new Date(date) },
    });

    res.status(201).json(maintenanceLog);
  } catch (error) {
    console.error('Create maintenance log error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMaintenanceLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, type } = req.query;

    const logs = await prisma.maintenanceLog.findMany({
      where: {
        equipment: {
          userId: req.userId!,
        },
        ...(startDate && { date: { gte: new Date(startDate as string) } }),
        ...(endDate && { date: { lte: new Date(endDate as string) } }),
        ...(type && { type: type as MaintenanceType }),
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(logs);
  } catch (error) {
    console.error('Get maintenance logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMaintenanceLogsByEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId } = req.params;

    const equipment = await prisma.equipment.findFirst({
      where: {
        id: equipmentId,
        userId: req.userId!,
      },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const logs = await prisma.maintenanceLog.findMany({
      where: { equipmentId },
      orderBy: { date: 'desc' },
    });

    res.json(logs);
  } catch (error) {
    console.error('Get maintenance logs by equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteMaintenanceLog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const log = await prisma.maintenanceLog.findFirst({
      where: {
        id,
        equipment: {
          userId: req.userId!,
        },
      },
    });

    if (!log) {
      return res.status(404).json({ error: 'Maintenance log not found' });
    }

    await prisma.maintenanceLog.delete({ where: { id } });

    res.json({ message: 'Maintenance log deleted successfully' });
  } catch (error) {
    console.error('Delete maintenance log error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};