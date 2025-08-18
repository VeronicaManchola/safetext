import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useAuth } from 'src/context/AuthContext';

import Button from '@components/Button';
import Input from '@components/Input';

import { Colors } from '@constants/colors';

import { isValidEmail } from '@utils/validators';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading, user } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acepto, setAcepto] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace('/(tabs)/home');
  }, [user, router]);

  const canSubmit = useMemo(() => {
    const okEmail = isValidEmail(email.trim());
    const okPwd = password.length >= 6 && password === confirm;
    return okEmail && okPwd && acepto;
  }, [email, password, confirm, acepto]);

  async function handleRegister() {
    setError(null);
    if (!canSubmit) {
      Alert.alert('Revisa los datos', 'Verifica correo, contraseña y aceptación de términos.');
      return;
    }
    try {
      await signUp(email.trim(), password, nombre.trim());
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible crear la cuenta');
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.topbar}>
        <View style={[styles.logo, { backgroundColor: Colors.light.textContrast }]}>
          <View style={[styles.logoShield, { backgroundColor: '#054BA6' }]} />
        </View>
        <Text style={[styles.brand, { color: '#054BA6' }]}>SafeText</Text>
      </View>

      <View style={styles.header}>
        <View style={[styles.badge, { borderColor: '#8FAFD9', backgroundColor: C.background }]}>
          <View style={[styles.badgeShield, { backgroundColor: '#054BA6' }]} />
        </View>
        <Text style={[styles.title, { color: '#054BA6' }]}>Crear cuenta</Text>
        <Text style={[styles.subtitle, { color: C.text }]} accessibilityElementsHidden>
          Únete y comienza a proteger tus mensajes
        </Text>
      </View>

      <View
        style={[styles.card, { borderColor: '#8FAFD9', backgroundColor: C.surface ?? '#FFFFFF' }]}
      >
        <View style={styles.form}>
          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: C.text }]}>Nombre</Text>
              <Input placeholder="Andrea" value={nombre} onChangeText={setNombre} />
            </View>
          </View>

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

          <View>
            <Text style={[styles.label, { color: C.text }]}>Confirmar contraseña</Text>
            <Input
              placeholder="••••••••"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.terms} onPress={() => setAcepto((v) => !v)}>
            <View
              style={[
                styles.checkbox,
                { borderColor: '#8FAFD9', backgroundColor: acepto ? '#035AA6' : 'transparent' },
              ]}
            />
            <Text style={[styles.termsText, { color: C.text }]}>
              Acepto los
              <Text style={[styles.link, { color: '#054BA6' }]}> Términos </Text>y la
              <Text style={[styles.link, { color: '#054BA6' }]}> Política de privacidad</Text>.
            </Text>
          </Pressable>

          <Button
            title={loading ? 'Creando…' : 'Crear cuenta'}
            onPress={handleRegister}
            disabled={loading || !canSubmit}
          />

          <Text style={[styles.alt, { color: C.text }]}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/(auth)/login" style={{ color: '#054BA6' }}>
              Inicia sesión
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
    textAlign: 'center',
  },
  card: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 18,
  },
  form: {
    gap: 12,
  },
  row2: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    opacity: 0.9,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    marginTop: 2,
  },
  termsText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  link: {
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
