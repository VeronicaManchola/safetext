import { Redirect } from 'expo-router';

import { useAuth } from '@providers/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
