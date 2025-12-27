// components/EquipmentTab.tsx
import React from 'react';
import { Plus, Wrench, Trash2 } from 'lucide-react';
import type { Equipment } from '../types';
import { getStatusColor, formatDate } from '../utils/helpers';

interface EquipmentTabProps {
  equipment: Equipment[];
  setShowAddModal: (show: boolean) => void;
  setSelectedEquipment: (equipment: Equipment) => void;
  setShowMaintenanceModal: (show: boolean) => void;
  deleteEquipment: (id: string) => void;
}

export const EquipmentTab: React.FC<EquipmentTabProps> = ({
  equipment,
  setShowAddModal,
  setSelectedEquipment,
  setShowMaintenanceModal,
  deleteEquipment,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Equipment List</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map(eq => (
          <div key={eq.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{eq.name}</h3>
                <p className="text-slate-600">{eq.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(eq.status)}`}>
                {eq.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <p className="text-slate-600">
                <span className="font-medium">Purchased:</span> {formatDate(eq.purchaseDate)}
              </p>
              <p className="text-slate-600">
                <span className="font-medium">Last Maintenance:</span> {formatDate(eq.lastMaintenance)}
              </p>
              <p className="text-slate-600">
                <span className="font-medium">Next Maintenance:</span> {formatDate(eq.nextMaintenance)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedEquipment(eq);
                  setShowMaintenanceModal(true);
                }}
                className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Log Maintenance
              </button>
              <button
                onClick={() => deleteEquipment(eq.id)}
                className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No equipment added yet</p>
          <p className="text-slate-400">Click "Add Equipment" to get started</p>
        </div>
      )}
    </div>
  );
};