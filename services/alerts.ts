import { createLogger } from '../lib/logger';
import { supabase } from './supabase';

const log = createLogger('alerts');

export interface AlertProfile {
  id: string;
  user_id: string;
  name: string;
  keywords_include: string[];
  keywords_exclude: string[];
  category?: string;
  price_min?: number;
  price_max?: number;
  location?: string;
  radius_km?: number;
  condition?: string;
  seller_type?: string;
  is_active: boolean;
  marketplaces: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateAlertData {
  name: string;
  keywords_include?: string[];
  keywords_exclude?: string[];
  category?: string;
  price_min?: number;
  price_max?: number;
  location?: string;
  radius_km?: number;
  condition?: string;
  seller_type?: string;
  marketplaces?: string[];
}

export const alertsService = {
  getAlerts: async (userId: string) => {
    const { data, error } = await supabase
      .from('alert_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      log.error('alert list load failed', { userId, error });
    } else {
      log.info('alert list loaded', { userId, count: data?.length ?? 0 });
    }

    return { alerts: data as AlertProfile[] | null, error };
  },

  createAlert: async (userId: string, alertData: CreateAlertData) => {
    const { data, error } = await supabase
      .from('alert_profiles')
      .insert({
        user_id: userId,
        ...alertData,
      })
      .select()
      .single();

    if (error) {
      log.error('alert create failed', { userId, error });
    } else {
      log.info('alert created', { userId, alertId: data?.id });
    }

    return { alert: data as AlertProfile | null, error };
  },

  updateAlert: async (alertId: string, updates: Partial<CreateAlertData>) => {
    const { data, error } = await supabase
      .from('alert_profiles')
      .update(updates)
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      log.error('alert update failed', { alertId, changedFields: Object.keys(updates), error });
    } else {
      log.info('alert updated', { alertId });
    }

    return { alert: data as AlertProfile | null, error };
  },

  toggleAlert: async (alertId: string, isActive: boolean) => {
    const { data, error } = await supabase
      .from('alert_profiles')
      .update({ is_active: isActive })
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      log.error('alert toggle failed', { alertId, isActive, error });
    } else {
      log.info('alert toggled', { alertId, isActive });
    }

    return { alert: data as AlertProfile | null, error };
  },

  deleteAlert: async (alertId: string) => {
    const { error } = await supabase
      .from('alert_profiles')
      .delete()
      .eq('id', alertId);

    if (error) {
      log.error('alert delete failed', { alertId, error });
    } else {
      log.info('alert deleted', { alertId });
    }

    return { error };
  },
};
