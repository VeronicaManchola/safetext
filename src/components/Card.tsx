import { Text, View } from 'react-native';

import { colors } from '@constants/colors';

export default function Card({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.light.card,
        borderColor: colors.light.border,
        borderWidth: 2,
        borderRadius: 20,
        padding: 16,
      }}
    >
      <Text style={{ fontWeight: '800', marginBottom: 4 }}>{title}</Text>
      {subtitle ? <Text style={{ opacity: 0.7 }}>{subtitle}</Text> : null}
    </View>
  );
}
