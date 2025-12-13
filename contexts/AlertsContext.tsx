import { createContext, ReactNode } from 'react';
import { AlertProfile, CreateAlertData } from '../services/alerts';

export interface AlertsContextType {
  alerts: AlertProfile[];
  loading: boolean;
  refreshing: boolean;
  loadAlerts: () => Promise<void>;
  createAlert: (data: CreateAlertData) => Promise<{ error: any }>;
  updateAlert: (alertId: string, data: Partial<CreateAlertData>) => Promise<{ error: any }>;
  toggleAlert: (alertId: string, isActive: boolean) => Promise<{ error: any }>;
  deleteAlert: (alertId: string) => Promise<{ error: any }>;
  refresh: () => Promise<void>;
}

export const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
  throw new Error('AlertsProvider must be implemented in hooks/useAlerts.tsx');
}
