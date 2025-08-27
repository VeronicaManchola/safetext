import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import logo from '@assets/images/adaptive-icon.png';

import { Colors } from '@constants/colors';

import { useAuth } from '@context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || user) return null;

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.surface }]}>
      <Image source={logo} style={{ width: 200, height: 200, marginBottom: 32 }} />

      <View style={styles.buttons}>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.secondaryButtonText}>Registrarse</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.title,
    marginTop: 16,
    marginBottom: 32,
  },
  buttons: {
    gap: 14,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.light.buttonPrimaryText,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: Colors.light.card,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    color: Colors.light.title,
    fontWeight: '700',
  },
});
