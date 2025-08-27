import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import AppHeader from '@components/AppHeader';
import Button from '@components/Button';
import PageTitle from '@components/PageTitle';

import { Colors } from '@constants/colors';

import { analyzeViaApi } from '@data/services/analysisApi';

import { useAnalysisViewModel } from '@viewmodels/useAnalysisViewModel';

export default function AnalysisScreen() {
  const { text, setText, result, loading, error, canScan, scan } = useAnalysisViewModel({
    analyzer: analyzeViaApi,
  });

  const feedback = useMemo(() => {
    if (!result) return null;
    const color = result.label === 'Posible phishing' ? '#A3083F' : '#035AA6';
    return (
      <View style={[styles.feedbackBox, { borderColor: color }]}>
        <Text style={[styles.feedbackLabel, { color }]}>{result.label}</Text>
        <Text style={styles.feedbackScore}>Riesgo: {(result.score * 100).toFixed(0)}%</Text>
        <View style={styles.feedbackSignals}>
          {result.signals.map((s, i) => (
            <Text key={i} style={styles.feedbackSignal}>
              • {s}
            </Text>
          ))}
        </View>
      </View>
    );
  }, [result]);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <AppHeader style={styles.header} />
      <PageTitle
        title="Análisis"
        subtitle="Pega un mensaje sospechoso y analizaremos su nivel de riesgo."
      />

      <TextInput
        placeholder="Pega aquí el mensaje o URL a analizar"
        value={text}
        onChangeText={setText}
        multiline
        style={styles.input}
        scrollEnabled
        textAlignVertical="top"
      />

      <Button title={loading ? 'Analizando…' : 'Analizar'} onPress={scan} disabled={!canScan} />

      {loading && <ActivityIndicator size="small" color={Colors.light.accent} />}

      {feedback}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: Colors.light.surface,
    gap: 16,
    flexGrow: 1,
  },
  header: {
    marginTop: 12,
    marginBottom: 16,
  },
  input: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: Colors.light.inputBg,
  },
  feedbackBox: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    backgroundColor: Colors.light.card,
    gap: 4,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackScore: {
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  feedbackSignals: {
    marginTop: 4,
    gap: 2,
  },
  feedbackSignal: {
    fontSize: 13,
    color: Colors.light.text,
  },
  error: {
    color: 'tomato',
    fontSize: 13,
  },
});
