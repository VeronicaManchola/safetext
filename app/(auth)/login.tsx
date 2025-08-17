import Button from "@components/Button";
import Input from "@components/Input";
import { useAuthViewModel } from "@hooks/useAuthViewModel";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function LoginScreen() {
  const vm = useAuthViewModel();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Iniciar sesión</Text>
      <Input
        placeholder="Correo"
        value={vm.email}
        onChangeText={vm.setEmail}
        keyboardType="email-address"
      />
      <Input
        placeholder="Contraseña"
        value={vm.password}
        onChangeText={vm.setPassword}
        secureTextEntry
      />
      <Button
        title={vm.loading ? "Ingresando…" : "Ingresar"}
        onPress={vm.login}
        disabled={vm.loading}
      />
      <Link href="/(auth)/register">¿No tienes cuenta? Regístrate</Link>
      {vm.error ? <Text style={{ color: "tomato" }}>{vm.error}</Text> : null}
    </View>
  );
}
