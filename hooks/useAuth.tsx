import { useState, useEffect, useContext, ReactNode } from 'react';
import { AppState } from 'react-native';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { authService } from '../services/auth';
import { createLogger } from '../lib/logger';
import { AuthContext, AuthContextType, Profile } from '../contexts/AuthContext';

const log = createLogger('auth');

const PROFILE_LOAD_ATTEMPTS = 3;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authService.getSession()
      .then(({ session }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        log.error('initial session read threw', { error });
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Handle app state changes
    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.unsubscribe();
      appStateListener.remove();
    };
  }, []);

  const loadProfile = async (userId: string, retries = PROFILE_LOAD_ATTEMPTS) => {
    const { profile, error } = await authService.getProfile(userId);

    if (error) {
      log.error('profile load failed', {
        userId,
        attempt: PROFILE_LOAD_ATTEMPTS - retries + 1,
        attemptsLeft: retries,
        error,
      });

      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return loadProfile(userId, retries - 1);
      }

      log.error('profile load gave up after all attempts', { userId, attempts: PROFILE_LOAD_ATTEMPTS + 1 });
    }

    if (!error && profile) {
      log.info('profile loaded', { userId });
      setProfile(profile);
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('AuthProvider: Starting signUp...');
    
    try {
      const { data, error } = await authService.signUp({ email, password, fullName });
      
      console.log('AuthProvider: signUp response', { 
        hasUser: !!data?.user, 
        hasSession: !!data?.session,
        error: error?.message 
      });
      
      if (error) {
        console.error('AuthProvider: signUp error:', error.message);
        return { error };
      }
      
      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        console.log('AuthProvider: Email confirmation required');
        return { 
          error: new Error('Please check your email to confirm your account') 
        };
      }
      
      console.log('AuthProvider: signUp successful');
      return { error: null };
    } catch (err) {
      console.error('AuthProvider: Unexpected error in signUp:', err);
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn({ email, password });
    return { error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) {
      log.error('sign out did not complete, cached session may remain', { userId: user?.id, error });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
