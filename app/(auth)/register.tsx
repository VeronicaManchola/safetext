import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import Button from '@components/Button';
import Input from '@components/Input';

import { useAuth } from '@providers/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);
    try {
      await signUp(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setError(e?.message ?? 'No fue posible crear la cuenta');
    }
  }

  if (user) {
    router.replace('/(tabs)/home');
    return null;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Crear cuenta</Text>

      <Input
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

      <Button
        title={loading ? 'Creando…' : 'Crear cuenta'}
        onPress={handleRegister}
        disabled={loading || !email || !password}
      />

      <Link href="/(auth)/login">¿Ya tienes cuenta? Inicia sesión</Link>

      {error ? <Text style={{ color: 'tomato' }}>{error}</Text> : null}
    </View>
  );
}
