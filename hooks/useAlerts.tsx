import { useState, useEffect, useContext, ReactNode } from 'react';
import { AlertProfile, CreateAlertData, alertsService } from '../services/alerts';
import { AlertsContext, AlertsContextType } from '../contexts/AlertsContext';
import { createLogger } from '../lib/logger';
import { useAuth } from './useAuth';

const log = createLogger('alerts');

export function AlertsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadAlerts();
    } else {
      setAlerts([]);
      setLoading(false);
    }
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;
    
    const { alerts: data, error } = await alertsService.getAlerts(user.id);
    if (!error && data) {
      setAlerts(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadAlerts();
  };

  const createAlert = async (data: CreateAlertData) => {
    if (!user) {
      log.error('alert create blocked, no authenticated user', {});
      return { error: new Error('Not authenticated') };
    }

    const { alert, error } = await alertsService.createAlert(user.id, data);
    if (!error && alert) {
      setAlerts((prev) => [alert, ...prev]);
    }
    return { error };
  };

  const updateAlert = async (alertId: string, data: Partial<CreateAlertData>) => {
    const { alert, error } = await alertsService.updateAlert(alertId, data);
    if (!error && alert) {
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? alert : a)));
    }
    return { error };
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    const { alert, error } = await alertsService.toggleAlert(alertId, isActive);
    if (!error && alert) {
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? alert : a)));
    }
    return { error };
  };

  const deleteAlert = async (alertId: string) => {
    const { error } = await alertsService.deleteAlert(alertId);
    if (!error) {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }
    return { error };
  };

  const value: AlertsContextType = {
    alerts,
    loading,
    refreshing,
    loadAlerts,
    createAlert,
    updateAlert,
    toggleAlert,
    deleteAlert,
    refresh,
  };

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within AlertsProvider');
  }
  return context;
}
