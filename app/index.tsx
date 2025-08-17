import { useAuthStore } from "@store/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }
  return <Redirect href="/(tabs)/home" />;
}
