import Card from "@components/Card";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>SafeText</Text>
      <Text style={{ opacity: 0.7 }}>Selecciona una opción</Text>

      <Link href="/(tabs)/analysis" asChild>
        <Card
          title="Analizar un mensaje"
          subtitle="Pega texto o URL y obtén veredicto"
        />
      </Link>

      <Link href="/(tabs)/history" asChild>
        <Card title="Ver historial" subtitle="Revisa análisis recientes" />
      </Link>
    </View>
  );
}
