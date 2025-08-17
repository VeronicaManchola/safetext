import { Text, View } from 'react-native';

import { colors } from '@constants/colors';

export default function Chip({ text }: { text: string }) {
  return (
    <View
      style={{
        borderColor: colors.light.border,
        borderWidth: 2,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: colors.light.chipBg,
      }}
    >
      <Text style={{ color: colors.light.chipText, fontSize: 12 }}>{text}</Text>
    </View>
  );
}
