import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@components/AppHeader';
import Button from '@components/Button';
import Card from '@components/Card';
import PageTitle from '@components/PageTitle';

import { Colors } from '@constants/colors';

import { useHistoryViewModel } from '@viewmodels/useHistoryViewModel';

export default function HistoryScreen() {
  const vm = useHistoryViewModel();

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <AppHeader style={styles.header} />
      <PageTitle title="Historial" subtitle="Consulta tus análisis recientes" />

      {vm.isEmpty ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay análisis aún.</Text>
        </View>
      ) : null}

      {vm.history.map((h) => (
        <Card
          key={h.id}
          title={`${h.label} • ${(h.score * 100).toFixed(0)}%`}
          subtitle={h.snippet}
        />
      ))}

      <Button
        title={vm.loading ? 'Cargando…' : 'Cargar más'}
        onPress={vm.loadMore}
        disabled={vm.loading || !vm.hasMore}
      />

      {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}
    </ScrollView>
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
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  error: {
    marginTop: 12,
    color: 'tomato',
  },
});
