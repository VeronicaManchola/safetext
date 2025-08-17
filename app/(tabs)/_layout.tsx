import { Colors } from "@constants/colors";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Inicio" }} />
      <Tabs.Screen name="analysis" options={{ title: "Análisis" }} />
      <Tabs.Screen name="history" options={{ title: "Historial" }} />
    </Tabs>
  );
}
