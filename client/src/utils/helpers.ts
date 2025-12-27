// utils/helpers.ts
import type { Equipment } from '../types';

export const getStatusColor = (status: Equipment['status']) => {
  const colors = {
    GOOD: 'bg-green-100 text-green-800',
    WARNING: 'bg-yellow-100 text-yellow-800',
    CRITICAL: 'bg-red-100 text-red-800',
    MAINTENANCE: 'bg-blue-100 text-blue-800',
  };
  return colors[status];
};

export const getDaysUntilMaintenance = (nextDate: string | null) => {
  if (!nextDate) return null;
  const today = new Date();
  const next = new Date(nextDate);
  const diffTime = next.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};