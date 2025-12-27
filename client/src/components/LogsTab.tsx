// components/LogsTab.tsx
import React from 'react';
import { Calendar } from 'lucide-react';
import type { MaintenanceLog } from '../types';
import { formatDate } from '../utils/helpers';

interface LogsTabProps {
  maintenanceLogs: MaintenanceLog[];
}

export const LogsTab: React.FC<LogsTabProps> = ({ maintenanceLogs }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Maintenance History</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Equipment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Cost</th>
            </tr>
          </thead>
          <tbody>
            {[...maintenanceLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
              <tr key={log.id} className="border-t border-slate-100">
                <td className="px-6 py-4 text-slate-800 font-medium">{log.equipment?.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{log.description}</td>
                <td className="px-6 py-4 text-slate-600">{formatDate(log.date)}</td>
                <td className="px-6 py-4 text-green-600 font-medium">
                  {log.cost ? `$${log.cost.toFixed(2)}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {maintenanceLogs.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No maintenance logs yet</p>
          </div>
        )}
      </div>
    </div>
  );
};