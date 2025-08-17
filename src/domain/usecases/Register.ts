import { AuthRepository } from "../repositories/AuthRepository";
export const register =
  (repo: AuthRepository) => async (email: string, password: string) =>
    repo.register(email, password);
