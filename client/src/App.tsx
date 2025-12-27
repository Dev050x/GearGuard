// App.tsx
import React, { useState, useEffect } from 'react';
import { api } from './api/config';
import type { User, Equipment, MaintenanceLog } from './types';
import { getDaysUntilMaintenance } from './utils/helpers';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { EquipmentTab } from './components/EquipmentTab';
import { LogsTab } from './components/LogsTab';
import { AddEquipmentModal } from './components/AddEquipmentModal';
import { MaintenanceModal } from './components/MaintenanceModal';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vehicle',
    purchaseDate: '',
    nextMaintenance: '',
    status: 'GOOD' as Equipment['status'],
    notes: '',
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'ROUTINE' as MaintenanceLog['type'],
    description: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const token = localStorage.getItem('gearguard_token');
    const savedUser = localStorage.getItem('gearguard_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setShowAuthModal(false);
      fetchEquipment();
      fetchMaintenanceLogs();
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : authForm;

      const response = await api.post(endpoint, payload);
      const { user, token } = response.data;

      localStorage.setItem('gearguard_token', token);
      localStorage.setItem('gearguard_user', JSON.stringify(user));
      setUser(user);
      setShowAuthModal(false);

      fetchEquipment();
      fetchMaintenanceLogs();

      setAuthForm({ email: '', password: '', name: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gearguard_token');
    localStorage.removeItem('gearguard_user');
    setUser(null);
    setEquipment([]);
    setMaintenanceLogs([]);
    setShowAuthModal(true);
    setActiveTab('dashboard');
  };

  const fetchEquipment = async () => {
    try {
      const response = await api.get('/equipment');
      setEquipment(response.data);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    }
  };

  const fetchMaintenanceLogs = async () => {
    try {
      const response = await api.get('/maintenance');
      setMaintenanceLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch maintenance logs:', err);
    }
  };

  const addEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : null,
        nextMaintenance: formData.nextMaintenance ? new Date(formData.nextMaintenance).toISOString() : null,
        notes: formData.notes || null,
      };

      await api.post('/equipment', payload);
      await fetchEquipment();

      setFormData({
        name: '',
        category: 'Vehicle',
        purchaseDate: '',
        nextMaintenance: '',
        status: 'GOOD',
        notes: '',
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add equipment');
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      await api.delete(`/equipment/${id}`);
      await fetchEquipment();
      await fetchMaintenanceLogs();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete equipment');
    }
  };

  const addMaintenanceLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    setLoading(true);

    try {
      const payload = {
        equipmentId: selectedEquipment.id,
        type: maintenanceForm.type,
        description: maintenanceForm.description,
        cost: maintenanceForm.cost ? parseFloat(maintenanceForm.cost) : null,
        date: new Date(maintenanceForm.date).toISOString(),
      };

      await api.post('/maintenance', payload);
      await fetchEquipment();
      await fetchMaintenanceLogs();

      setMaintenanceForm({
        type: 'ROUTINE',
        description: '',
        cost: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowMaintenanceModal(false);
      setSelectedEquipment(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add maintenance log');
    } finally {
      setLoading(false);
    }
  };

  const upcomingMaintenance = equipment
    .filter(eq => eq.nextMaintenance)
    .map(eq => ({
      ...eq,
      daysUntil: getDaysUntilMaintenance(eq.nextMaintenance),
    }))
    .sort((a, b) => (a.daysUntil || 0) - (b.daysUntil || 0))
    .slice(0, 5);

  const recentLogs = [...maintenanceLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (showAuthModal) {
    return (
      <AuthModal
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <Header user={user} handleLogout={handleLogout} />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-900 hover:text-red-700">×</button>
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {['dashboard', 'equipment', 'logs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <DashboardTab
            equipment={equipment}
            maintenanceLogs={maintenanceLogs}
            upcomingMaintenance={upcomingMaintenance}
            recentLogs={recentLogs}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentTab
            equipment={equipment}
            setShowAddModal={setShowAddModal}
            setSelectedEquipment={setSelectedEquipment}
            setShowMaintenanceModal={setShowMaintenanceModal}
            deleteEquipment={deleteEquipment}
          />
        )}

        {activeTab === 'logs' && (
          <LogsTab maintenanceLogs={maintenanceLogs} />
        )}

        {showAddModal && (
          <AddEquipmentModal
            formData={formData}
            setFormData={setFormData}
            addEquipment={addEquipment}
            setShowAddModal={setShowAddModal}
            loading={loading}
          />
        )}

        {showMaintenanceModal && selectedEquipment && (
          <MaintenanceModal
            selectedEquipment={selectedEquipment}
            maintenanceForm={maintenanceForm}
            setMaintenanceForm={setMaintenanceForm}
            addMaintenanceLog={addMaintenanceLog}
            setShowMaintenanceModal={setShowMaintenanceModal}
            setSelectedEquipment={setSelectedEquipment}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default App;