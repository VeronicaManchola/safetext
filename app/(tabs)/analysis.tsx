import Button from "@components/Button";
import Chip from "@components/Chip";
import Input from "@components/Input";
import { useAnalysisViewModel } from "@hooks/useAnalysisViewModel";
import { Text, View } from "react-native";

export default function AnalysisScreen() {
  const vm = useAnalysisViewModel();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Analizar</Text>
      <Input
        placeholder="Pega un mensaje o URL…"
        value={vm.text}
        onChangeText={vm.setText}
        multiline
      />

      <Button
        title={vm.loading ? "Escaneando…" : "Scan"}
        onPress={vm.scan}
        disabled={vm.loading || !vm.text.trim()}
      />

      {vm.result && (
        <View style={{ gap: 8 }}>
          <Text style={{ fontWeight: "700" }}>
            {vm.result.label} • Riesgo {Math.round(vm.result.score * 100)}/100
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {vm.result.signals.map((s, i) => (
              <Chip key={i} text={s} />
            ))}
          </View>
        </View>
      )}

      {vm.error ? <Text style={{ color: "tomato" }}>{vm.error}</Text> : null}
    </View>
  );
}
