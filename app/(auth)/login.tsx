import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import Button from '@components/Button';
import Input from '@components/Input';

import { colors } from '@constants/colors';

import { useAuth } from '@providers/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, user } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const C = colors[scheme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true); // UI-only por ahora
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace('/(tabs)/home');
  }, [user, router]);

  const canSubmit = useMemo(() => {
    const okEmail = /\S+@\S+\.\S+/.test(email.trim());
    return okEmail && password.length > 0;
  }, [email, password]);

  async function handleLogin() {
    setError(null);
    try {
      await signIn(email.trim(), password);
      // redirección ocurre en el useEffect
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible iniciar sesión');
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      {/* Topbar con logo y marca */}
      <View style={styles.topbar}>
        {/* Badge de logo simple para RN; reemplázalo por tu componente/Icono si lo tienes */}
        <View style={[styles.logo, { backgroundColor: colors.light.textContrast }]}>
          <View style={[styles.logoShield, { backgroundColor: '#054BA6' }]} />
        </View>
        <Text style={[styles.brand, { color: '#054BA6' }]}>SafeText</Text>
      </View>

      {/* Header centrado */}
      <View style={styles.header}>
        <View style={[styles.badge, { borderColor: '#8FAFD9', backgroundColor: C.background }]}>
          <View style={[styles.badgeShield, { backgroundColor: '#054BA6' }]} />
        </View>
        <Text style={[styles.title, { color: '#054BA6' }]}>Iniciar sesión</Text>
        <Text style={[styles.subtitle, { color: C.text }]} accessibilityElementsHidden>
          Accede para analizar mensajes y ver tu historial
        </Text>
      </View>

      {/* Card del formulario */}
      <View
        style={[styles.card, { borderColor: '#8FAFD9', backgroundColor: C.surface ?? '#FFFFFF' }]}
        accessibilityLabel="Formulario de inicio de sesión"
      >
        <View style={styles.form}>
          <View>
            <Text style={[styles.label, { color: C.text }]}>Correo electrónico</Text>
            <Input
              placeholder="tucorreo@dominio.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: C.text }]}>Contraseña</Text>
            <Input
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.row}>
            <Pressable style={styles.remember} onPress={() => setRemember((v) => !v)}>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: '#8FAFD9',
                    backgroundColor: remember ? '#035AA6' : 'transparent',
                  },
                ]}
              />
              <Text style={[styles.rememberText, { color: C.text }]}>Recuérdame</Text>
            </Pressable>

            {/* <Link href="/(auth)/reset" style={[styles.forgot, { color: '#054BA6' }]}>
              ¿Olvidaste tu contraseña?
            </Link> */}
          </View>

          <Button
            title={loading ? 'Ingresando…' : 'Ingresar'}
            onPress={handleLogin}
            disabled={loading || !canSubmit}
          />

          <Text style={[styles.alt, { color: C.text }]}>
            ¿No tienes cuenta?{' '}
            <Link href="/(auth)/register" style={{ color: '#054BA6' }}>
              Regístrate
            </Link>
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoShield: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  header: {
    alignItems: 'center',
    marginTop: 6,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeShield: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
  card: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 18,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    opacity: 0.9,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
  },
  rememberText: {
    fontSize: 13,
  },
  forgot: {
    fontSize: 13,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  alt: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 6,
  },
  error: {
    color: 'tomato',
    marginTop: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
});
