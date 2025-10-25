import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@constants/colors';

type CardVariant = 'safe' | 'warning' | 'danger' | 'default';
type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
};

export default function Card({ title, subtitle, icon, onPress, variant = 'default' }: Props) {
  const colorMap = {
    safe: Colors.light.riskSafe,
    warning: Colors.light.riskWarning,
    danger: Colors.light.riskDanger,
    default: Colors.light.border,
  };
  const borderColor = colorMap[variant];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { borderColor }]}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.border,
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: '#f9fbff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
});
