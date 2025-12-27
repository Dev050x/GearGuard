// components/DashboardTab.tsx
import React from 'react';
import { Wrench, Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import type { Equipment, MaintenanceLog } from '../types';
import { formatDate } from '../utils/helpers';

interface DashboardTabProps {
  equipment: Equipment[];
  maintenanceLogs: MaintenanceLog[];
  upcomingMaintenance: (Equipment & { daysUntil: number | null })[];
  recentLogs: MaintenanceLog[];
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  equipment,
  maintenanceLogs,
  upcomingMaintenance,
  recentLogs,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Equipment</p>
              <p className="text-3xl font-bold text-slate-800">{equipment.length}</p>
            </div>
            <Wrench className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Good Condition</p>
              <p className="text-3xl font-bold text-green-600">
                {equipment.filter(e => e.status === 'GOOD').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Needs Attention</p>
              <p className="text-3xl font-bold text-yellow-600">
                {equipment.filter(e => e.status === 'WARNING').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Logs</p>
              <p className="text-3xl font-bold text-slate-800">{maintenanceLogs.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Upcoming Maintenance
        </h2>
        {upcomingMaintenance.length === 0 ? (
          <p className="text-slate-500">No upcoming maintenance scheduled</p>
        ) : (
          <div className="space-y-3">
            {upcomingMaintenance.map(eq => (
              <div key={eq.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800">{eq.name}</p>
                  <p className="text-sm text-slate-600">{eq.category}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    (eq.daysUntil || 0) < 0 ? 'text-red-600' :
                    (eq.daysUntil || 0) <= 7 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {(eq.daysUntil || 0) < 0 ? `${Math.abs(eq.daysUntil || 0)} days overdue` :
                      eq.daysUntil === 0 ? 'Today' :
                      `${eq.daysUntil} days`}
                  </p>
                  <p className="text-sm text-slate-600">{formatDate(eq.nextMaintenance)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
        {recentLogs.length === 0 ? (
          <p className="text-slate-500">No maintenance logs yet</p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map(log => (
              <div key={log.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{log.equipment?.name}</p>
                  <p className="text-sm text-slate-600">{log.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{log.type}</p>
                  <p className="text-sm text-slate-600">{formatDate(log.date)}</p>
                  {log.cost && <p className="text-sm text-green-600">${log.cost.toFixed(2)}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};