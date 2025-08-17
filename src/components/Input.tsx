import { TextInput, TextInputProps } from 'react-native';

import { colors } from '@constants/colors';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#6b7280"
      {...props}
      style={[
        {
          backgroundColor: colors.light.inputBg,
          borderColor: colors.light.border,
          borderWidth: 2,
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 12,
          fontSize: 16,
        },
        props.style,
      ]}
    />
  );
}
