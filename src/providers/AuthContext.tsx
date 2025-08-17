import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@data/sources/supabaseClient';

type AuthUser = {
  id: string;
  email?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error?: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          if (mounted) setError(error.message);
          return;
        }
        if (mounted) {
          setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ? { id: session.user.id, email: session.user.email } : null;
      setUser(u);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(undefined);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
    } catch (e: any) {
      setError(e?.message ?? 'Error al iniciar sesión');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setError(undefined);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
    } catch (e: any) {
      setError(e?.message ?? 'Error al registrar la cuenta');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setError(undefined);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cerrar sesión');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, error, signIn, signUp, signOut }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
