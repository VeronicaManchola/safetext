import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider } from '@context/AuthContext';
import { UIProvider } from '@context/UIContext';

export default function Layout() {
  return (
    <AuthProvider>
      <UIProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <View style={styles.inner}>
            <Slot />
          </View>
        </SafeAreaView>
      </UIProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
});
