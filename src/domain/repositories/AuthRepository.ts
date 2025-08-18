export type AuthUser = {
  id: string;
  email?: string;
};

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(email: string, password: string, name?: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
