// components/MaintenanceModal.tsx
import React from 'react';
import type { Equipment, MaintenanceLog } from '../types';

interface MaintenanceModalProps {
  selectedEquipment: Equipment;
  maintenanceForm: {
    type: MaintenanceLog['type'];
    description: string;
    cost: string;
    date: string;
  };
  setMaintenanceForm: (data: any) => void;
  addMaintenanceLog: (e: React.FormEvent) => void;
  setShowMaintenanceModal: (show: boolean) => void;
  setSelectedEquipment: (equipment: Equipment | null) => void;
  loading: boolean;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  selectedEquipment,
  maintenanceForm,
  setMaintenanceForm,
  addMaintenanceLog,
  setShowMaintenanceModal,
  setSelectedEquipment,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Log Maintenance</h2>
        <p className="text-slate-600 mb-4">for {selectedEquipment.name}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance Type</label>
            <select
              value={maintenanceForm.type}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, type: e.target.value as MaintenanceLog['type'] })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ROUTINE">Routine</option>
              <option value="REPAIR">Repair</option>
              <option value="INSPECTION">Inspection</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              required
              value={maintenanceForm.description}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cost (optional)</label>
            <input
              type="number"
              step="0.01"
              value={maintenanceForm.cost}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={maintenanceForm.date}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowMaintenanceModal(false);
                setSelectedEquipment(null);
              }}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={addMaintenanceLog}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};