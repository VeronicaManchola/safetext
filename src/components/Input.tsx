import { TextInput, TextInputProps } from 'react-native';

import { Colors } from '@constants/colors';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#6b7280"
      {...props}
      style={[
        {
          backgroundColor: Colors.light.inputBg,
          borderColor: Colors.light.border,
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
