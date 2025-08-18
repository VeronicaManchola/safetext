import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider } from 'src/context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.inner}>
          <Slot />
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  inner: {
    flex: 1,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
});
