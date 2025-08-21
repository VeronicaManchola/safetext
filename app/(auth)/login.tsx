import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import logo from '@assets/images/adaptive-icon.png';

import Button from '@components/Button';
import Input from '@components/Input';

import { Colors } from '@constants/colors';

import { useAuth } from '@context/AuthContext';

import { isValidEmail } from '@utils/validators';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, user } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace('/(tabs)/home');
  }, [user, router]);

  const canSubmit = useMemo(() => {
    const okEmail = isValidEmail(email.trim());
    return okEmail && password.length > 0;
  }, [email, password]);

  async function handleLogin() {
    setError(null);
    try {
      await signIn(email.trim(), password, remember);
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible iniciar sesión');
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.surface }]}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Image source={logo} style={[styles.badgeShield]} />
        </View>
        <Text style={[styles.title, { color: '#054BA6' }]}>Iniciar sesión</Text>
        <Text style={[styles.subtitle, { color: C.text }]} accessibilityElementsHidden>
          Accede para analizar mensajes y ver tu historial
        </Text>
      </View>

      <View
        style={[styles.card, { borderColor: '#8FAFD9', backgroundColor: '#FFFFFF' }]}
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
  header: {
    alignItems: 'center',
    marginTop: 6,
  },
  badge: {
    marginVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeShield: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
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
