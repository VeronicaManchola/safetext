import { AuthRepository } from "../repositories/AuthRepository";
export const login =
  (repo: AuthRepository) => async (email: string, password: string) =>
    repo.login(email, password);
