import { http } from "@api//client";
import { AuthRepository } from "@domain//repositories/AuthRepository";

export const authRepositoryHttp: AuthRepository = {
  async login(email, password) {
    return http<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async register(email, password) {
    return http<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async logout() {
    /* no-op en mock */ return;
  },
};
