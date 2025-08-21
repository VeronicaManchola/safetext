import { supabase } from '@data/sources/supabaseClient';

import { AuthUser } from '@domain/entities/user';
import { AuthRepository } from '@domain/repositories/AuthRepository';

export const authRepository: AuthRepository = {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw error ?? new Error('No user');
    return { id: data.user.id, email: data.user.email ?? undefined };
  },

  async signUp(email: string, password: string, name?: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
      },
    });
    if (error || !data.user) throw error ?? new Error('No user');
    return { id: data.user.id, email: data.user.email ?? undefined };
  },

  async signOut(): Promise<void> {
    console.log('Signing out in supabase...');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;
    return user ? { id: user.id, email: user.email ?? undefined } : null;
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user
        ? { id: session.user.id, email: session.user.email ?? undefined }
        : null;
      callback(u);
    });
    return () => sub.subscription.unsubscribe();
  },
};
