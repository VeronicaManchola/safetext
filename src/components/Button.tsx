import { Text, TouchableOpacity } from 'react-native';

import { colors } from '@constants/colors';

type Props = { title: string; onPress: () => void; disabled?: boolean };
export default function Button({ title, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#B6C8E6' : colors.light.buttonPrimary,
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: colors.light.buttonPrimaryText, fontWeight: '700' }}>{title}</Text>
    </TouchableOpacity>
  );
}
