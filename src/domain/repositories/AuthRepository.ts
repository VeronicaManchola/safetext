export interface AuthRepository {
  login(email: string, password: string): Promise<{ token: string }>;
  register(email: string, password: string): Promise<{ token: string }>;
  logout(): Promise<void>;
}
