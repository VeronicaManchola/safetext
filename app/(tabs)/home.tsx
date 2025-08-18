import { useRouter } from 'expo-router';
import { History, MessageSquare } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import AppHeader from '@components/AppHeader';
import Card from '@components/Card';
import PageTitle from '@components/PageTitle';

import { Colors } from '@constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <AppHeader style={styles.header} />
      <PageTitle title="Bienvenida" subtitle="Selecciona una opción para comenzar" />

      <View style={styles.options}>
        <Card
          title="Analizar un mensaje"
          subtitle="Pega texto y obtén un veredicto."
          icon={<MessageSquare color={Colors.light.accent} size={20} />}
          onPress={() => router.push('/(tabs)/analysis')}
        />
        <Card
          title="Ver historial"
          subtitle="Consulta tus análisis recientes."
          icon={<History color={Colors.light.accent} size={20} />}
          onPress={() => router.push('/(tabs)/history')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: Colors.light.surface,
  },
  header: {
    marginTop: 12,
    marginBottom: 16,
  },
  options: {
    gap: 20,
    marginTop: 16,
  },
  footer: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 24,
    textAlign: 'center',
  },
});
