import Button from "@components/Button";
import Input from "@components/Input";
import { useAuthViewModel } from "@hooks/useAuthViewModel";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function RegisterScreen() {
  const vm = useAuthViewModel();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Crear cuenta</Text>
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
        title={vm.loading ? "Creando…" : "Crear cuenta"}
        onPress={vm.register}
        disabled={vm.loading}
      />
      <Link href="/(auth)/login">¿Ya tienes cuenta? Inicia sesión</Link>
      {vm.error ? <Text style={{ color: "tomato" }}>{vm.error}</Text> : null}
    </View>
  );
}
