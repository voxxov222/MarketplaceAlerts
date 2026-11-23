import { createLogger } from '../lib/logger';
import { supabase } from './supabase';

const log = createLogger('auth');

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  signUp: async ({ email, password, fullName }: SignUpData) => {
    console.log('authService: Calling Supabase signUp...');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });
      
      console.log('authService: Supabase signUp response', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        hasError: !!error,
        errorMessage: error?.message
      });
      
      return { data, error };
    } catch (err) {
      console.error('authService: Exception during signUp:', err);
      throw err;
    }
  },

  signIn: async ({ email, password }: SignInData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      log.error('sign in failed', { error });
    } else {
      log.info('sign in succeeded', { userId: data?.user?.id });
    }

    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      log.error('sign out failed', { error });
    } else {
      log.info('sign out succeeded');
    }

    return { error };
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      log.error('session read failed', { error });
    }

    return { session: data.session, error };
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { profile: data, error };
  },
};
