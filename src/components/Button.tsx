import { Colors } from "@constants/colors";
import { Text, TouchableOpacity } from "react-native";

type Props = { title: string; onPress: () => void; disabled?: boolean };
export default function Button({ title, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#B6C8E6" : Colors.light.buttonPrimary,
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
      }}
    >
      <Text
        style={{ color: Colors.light.buttonPrimaryText, fontWeight: "700" }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
