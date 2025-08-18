import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors } from '@constants/colors';

type AppHeaderProps = {
  style?: ViewStyle;
};

export default function AppHeader({ style }: AppHeaderProps) {
  return (
    <View style={[styles.topbar, style]}>
      <View style={styles.logo}>
        {/* Aquí luego reemplazarás esto por la imagen oficial */}
        <View style={styles.logoBubble} />
      </View>
      <Text style={styles.brand}>SafeText</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.light.title,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBubble: {
    width: 14,
    height: 10,
    borderRadius: 4,
    backgroundColor: Colors.light.textContrast,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.title,
    letterSpacing: 0.2,
  },
});
