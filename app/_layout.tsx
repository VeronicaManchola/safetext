import { Slot } from 'expo-router';
import { View } from 'react-native';

import { AuthProvider } from '@providers/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </AuthProvider>
  );
}
