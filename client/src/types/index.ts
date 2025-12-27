// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  purchaseDate: string | null;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  status: 'GOOD' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
  notes: string | null;
  maintenanceLogs?: MaintenanceLog[];
}

export interface MaintenanceLog {
  id: string;
  type: 'ROUTINE' | 'REPAIR' | 'INSPECTION' | 'EMERGENCY';
  description: string;
  cost: number | null;
  date: string;
  equipmentId: string;
  equipment?: {
    id: string;
    name: string;
    category: string;
  };
}