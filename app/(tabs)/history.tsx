import Button from "@components/Button";
import Card from "@components/Card";
import { useAnalysisViewModel } from "@hooks/useAnalysisViewModel";
import { ScrollView, Text } from "react-native";

export default function HistoryScreen() {
  const vm = useAnalysisViewModel();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Historial</Text>
      {vm.history.map((h) => (
        <Card
          key={h.id}
          title={`${h.label} • ${Math.round(h.score * 100)}/100`}
          subtitle={h.snippet}
        />
      ))}
      <Button title="Cargar más" onPress={vm.loadMore} />
    </ScrollView>
  );
}
