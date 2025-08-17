import { Colors } from "@constants/colors";
import { Text, View } from "react-native";

export default function Card({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: Colors.light.card,
        borderColor: Colors.light.border,
        borderWidth: 2,
        borderRadius: 20,
        padding: 16,
      }}
    >
      <Text style={{ fontWeight: "800", marginBottom: 4 }}>{title}</Text>
      {subtitle ? <Text style={{ opacity: 0.7 }}>{subtitle}</Text> : null}
    </View>
  );
}
