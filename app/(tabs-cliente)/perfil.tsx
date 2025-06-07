import { Image, ScrollView, TouchableOpacity, Text } from "react-native";
import { Stack, router } from "expo-router";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

export default function PerfilScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { user, logout } = useAuthStore();

  return (
    <>
      <Stack.Screen options={{ title: "Mi cuenta" }} />
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 40,
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 120, height: 100, marginBottom: 16 }}
        />

        <ThemedText type="title" style={{ color: "white", marginBottom: 32 }}>
          Hola, {user?.nombre}!
        </ThemedText>

        <TouchableOpacity
          onPress={() => router.push("/(tabs-cliente)/editarUsuario")}
          style={{
            width: "100%",
            backgroundColor: "#759aad",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Modificar datos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          style={{
            width: "100%",
            backgroundColor: "#759aad",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
