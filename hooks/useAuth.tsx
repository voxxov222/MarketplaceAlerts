import { useState, useEffect, useContext, ReactNode } from 'react';
import { AppState } from 'react-native';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { authService } from '../services/auth';
import { AuthContext, AuthContextType, Profile } from '../contexts/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
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

  const loadProfile = async (userId: string, retries = 3) => {
    console.log(`AuthProvider: Loading profile for user ${userId} (retries left: ${retries})`);
    
    const { profile, error } = await authService.getProfile(userId);
    
    if (error) {
      console.error('AuthProvider: Profile load error:', error.message);
      
      if (retries > 0) {
        console.log('AuthProvider: Retrying profile load...');
        await new Promise(resolve => setTimeout(resolve, 500));
        return loadProfile(userId, retries - 1);
      }
      
      console.error('AuthProvider: Failed to load profile after all retries');
    }
    
    if (!error && profile) {
      console.log('AuthProvider: Profile loaded successfully');
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
    await authService.signOut();
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
