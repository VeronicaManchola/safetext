import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import OptionsModal from '@components/OptionsModal';

import { Colors } from '@constants/colors';

import { useAuth } from '@context/AuthContext';

export default function AppHeader({ style }: { style?: any }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { signOut } = useAuth();

  return (
    <View style={[styles.topbar, style]}>
      <Image source={require('@assets/images/favicon.png')} style={styles.logo} />
      <Text style={styles.brand}>SafeText</Text>

      <Pressable onPress={() => setModalVisible(true)} style={styles.settings}>
        <Ionicons name="settings-outline" size={24} color={Colors.light.accent} />
      </Pressable>

      <OptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={[
          {
            label: 'Cerrar sesión',
            onPress: () => {
              signOut();
              router.replace('/');
            },
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 6,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.title,
    letterSpacing: 0.2,
    flex: 1,
    marginLeft: 8,
  },
  settings: {
    padding: 8,
  },
});
