import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { AuthUser } from '@domain/repositories/AuthRepository';

import { authRepository } from '@data/repositories/AuthRepositorySupabase';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error?: string;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name?: string, remember?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const remember = await AsyncStorage.getItem('remember');
      if (remember !== 'true') {
        setLoading(false);
        return;
      }

      const u = await authRepository.getCurrentUser();
      if (mounted) {
        setUser(u);
        setLoading(false);
      }
    };

    bootstrap();

    const unsubscribe = authRepository.onAuthStateChange((u) => setUser(u));
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const clearError = () => setError(undefined);

  const signIn = async (email: string, password: string, remember = true) => {
    clearError();
    setLoading(true);
    try {
      const user = await authRepository.signIn(email, password);
      setUser(user);

      if (remember) {
        await AsyncStorage.setItem('remember', 'true');
      } else {
        await AsyncStorage.removeItem('remember');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error al iniciar sesión');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string, remember = true) => {
    clearError();
    setLoading(true);
    try {
      const user = await authRepository.signUp(email, password, name);
      setUser(user);

      if (remember) {
        await AsyncStorage.setItem('remember', 'true');
      } else {
        await AsyncStorage.removeItem('remember');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error al registrar la cuenta');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    clearError();
    setLoading(true);
    try {
      await authRepository.signOut();
      await AsyncStorage.removeItem('remember');
      setUser(null);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cerrar sesión');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, error, signIn, signUp, signOut, clearError }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
