import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@constants/colors';

type Props = {
  children: ReactNode;
};

export default function IconBox({ children }: Props) {
  return <View style={styles.box}>{children}</View>;
}

const styles = StyleSheet.create({
  box: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF4FB',
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
