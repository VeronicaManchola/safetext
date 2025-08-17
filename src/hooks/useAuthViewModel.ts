import { authRepositoryHttp } from "@services//authRepositoryHttp";
import { useAuthStore } from "@store/authStore";
import { useState } from "react";

export function useAuthViewModel(repo = authRepositoryHttp) {
  const { setToken } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setLoading(true);
    setError(null);
    try {
      const { token } = await repo.login(email, password);
      setToken(token);
    } catch (e: any) {
      setError(e.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }

  async function register() {
    setLoading(true);
    setError(null);
    try {
      const { token } = await repo.register(email, password);
      setToken(token);
    } catch (e: any) {
      setError(e.message ?? "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    login,
    register,
  };
}
