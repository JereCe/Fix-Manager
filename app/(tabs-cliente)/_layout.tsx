import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import LogoutButton from "@/presentation/auth/components/LogoutButton";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

export default function TabsLayout() {
  const { status, checkStatus } = useAuthStore();
  const backgroundColor = useThemeColor({}, "cardBackground");

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(status);
  if (status === "checking") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "unauthenticated") {
    return <Redirect href={"/auth/loginCliente"} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "white",
        },
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopWidth: 0.5,
          borderTopColor: "#444",
        },
        tabBarActiveTintColor: "#5CC6FF",
        tabBarInactiveTintColor: "#A5AAB1",
        headerRight: () => <LogoutButton />,
      }}
    >
      <Tabs.Screen
        name="(fix-manager)/(home-cliente)/index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Mi Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="(fix-manager)/vehiculos" options={{ href: null }} />
      <Tabs.Screen
        name="(fix-manager)/vehiculos/nuevo"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="(fix-manager)/vehiculos/editar/[id]"
        options={{ href: null }}
      />
    </Tabs>
  );
}
