import { ScrollView, Text, View } from 'react-native';

import Button from '@components/Button';
import Card from '@components/Card';

import { useHistoryViewModel } from '@viewmodels/useHistoryViewModel';

export default function HistoryScreen() {
  const vm = useHistoryViewModel();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Historial</Text>

      {vm.isEmpty ? (
        <View style={{ paddingVertical: 24 }}>
          <Text>No hay análisis aún.</Text>
        </View>
      ) : null}

      {vm.history.map((h) => (
        <Card
          key={h.id}
          title={`${h.label} • ${Math.round(h.score * 100)}/100`}
          subtitle={h.snippet}
        />
      ))}

      <Button
        title={vm.loading ? 'Cargando…' : 'Cargar más'}
        onPress={vm.loadMore}
        disabled={vm.loading || !vm.hasMore}
      />

      {vm.error ? <Text style={{ color: 'tomato' }}>{vm.error}</Text> : null}
    </ScrollView>
  );
}
