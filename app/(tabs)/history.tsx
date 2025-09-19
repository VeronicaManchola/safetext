import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@components/AppHeader';
import Card from '@components/Card';
import PageTitle from '@components/PageTitle';

import { Colors } from '@constants/colors';

import { useHistoryViewModel } from '@viewmodels/useHistoryViewModel';

export default function HistoryScreen() {
  const { history, hasMore, loading, refreshing, error, loadMore, reload } = useHistoryViewModel();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return (
    <View style={styles.screen}>
      <AppHeader style={styles.header} />
      <PageTitle title="Historial" subtitle="Consulta tus análisis recientes" />

      <FlatList
        data={history}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <Card
            title={`${item.label} • ${(item.score * 100).toFixed(0)}%`}
            subtitle={item.snippet}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No hay análisis aún.</Text>
            </View>
          )
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasMore && !loading) loadMore();
        }}
        ListFooterComponent={
          <View style={styles.footer}>
            {loading ? <Text style={styles.loading}>Cargando…</Text> : null}
            {!hasMore && history.length > 0 ? (
              <Text style={styles.end}>No hay más resultados</Text>
            ) : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: Colors.light.surface,
    gap: 16,
    flex: 1,
  },
  header: {
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  loading: { color: Colors.light.textMuted },
  end: { color: Colors.light.textMuted },
  error: { marginTop: 8, color: 'tomato' },
});
