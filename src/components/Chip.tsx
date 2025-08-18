import { Text, View } from 'react-native';

import { Colors } from '@constants/colors';

export default function Chip({ text }: { text: string }) {
  return (
    <View
      style={{
        borderColor: Colors.light.border,
        borderWidth: 2,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: Colors.light.chipBg,
      }}
    >
      <Text style={{ color: Colors.light.chipText, fontSize: 12 }}>{text}</Text>
    </View>
  );
}
