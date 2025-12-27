// components/Header.tsx
import React from 'react';
import { Wrench, LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  handleLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
  return (
    <div className="mb-8 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Wrench className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-800">GearGuard</h1>
        </div>
        <p className="text-slate-600">Ultimate Maintenance Tracker for Your Equipment</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-700">
          <UserIcon className="w-5 h-5" />
          <span className="font-medium">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};