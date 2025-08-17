import { Tabs } from 'expo-router';

import { colors } from '@constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.light.tabIconSelected,
        tabBarInactiveTintColor: colors.light.tabIconDefault,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="analysis" options={{ title: 'Análisis' }} />
      <Tabs.Screen name="history" options={{ title: 'Historial' }} />
    </Tabs>
  );
}
