//equipment controller
import { Response } from 'express';
import { PrismaClient, EquipmentStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateEquipmentInput, UpdateEquipmentInput } from '../schemas/equipment.schema';

const prisma = new PrismaClient();

export const createEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, purchaseDate, nextMaintenance, status, notes } = req.body as CreateEquipmentInput;

    const equipment = await prisma.equipment.create({
      data: {
        name,
        category,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : null,
        status: status as EquipmentStatus || 'GOOD',
        notes,
        userId: req.userId!,
      },
    });

    res.status(201).json(equipment);
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { category, status } = req.query;

    const equipment = await prisma.equipment.findMany({
      where: {
        userId: req.userId!,
        ...(category && { category: category as string }),
        ...(status && { status: status as EquipmentStatus }),
      },
      include: {
        maintenanceLogs: {
          orderBy: { date: 'desc' },
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEquipmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipment.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        maintenanceLogs: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment by id error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateEquipmentInput;

    const equipment = await prisma.equipment.findFirst({
      where: { id, userId: req.userId! },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.category && { category: updateData.category }),
        ...(updateData.purchaseDate !== undefined && { 
          purchaseDate: updateData.purchaseDate ? new Date(updateData.purchaseDate) : null 
        }),
        ...(updateData.lastMaintenance !== undefined && { 
          lastMaintenance: updateData.lastMaintenance ? new Date(updateData.lastMaintenance) : null 
        }),
        ...(updateData.nextMaintenance !== undefined && { 
          nextMaintenance: updateData.nextMaintenance ? new Date(updateData.nextMaintenance) : null 
        }),
        ...(updateData.status && { status: updateData.status as EquipmentStatus }),
        ...(updateData.notes !== undefined && { notes: updateData.notes }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipment.findFirst({
      where: { id, userId: req.userId! },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    await prisma.equipment.delete({ where: { id } });

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUpcomingMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const equipment = await prisma.equipment.findMany({
      where: {
        userId: req.userId!,
        nextMaintenance: {
          not: null,
        },
      },
      orderBy: {
        nextMaintenance: 'asc',
      },
      take: 10,
    });

    res.json(equipment);
  } catch (error) {
    console.error('Get upcoming maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};