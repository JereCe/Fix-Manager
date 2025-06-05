import { useEffect, useState } from "react";
import { View, ScrollView, Image, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

export default function TallerScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuthStore();

  const [taller, setTaller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaller = async () => {
      try {
        const { data } = await fixManagerApi.get(
          `/talleres/${user?.id}/taller`
        );
        setTaller(data);
      } catch (error) {
        console.log("Error al cargar taller", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaller();
  }, [user?.id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color="#5CC6FF" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Mi Taller" }} />
      <ScrollView style={{ flex: 1, padding: 20, backgroundColor }}>
        {taller && (
          <View
            style={{
              backgroundColor: "#1F2E3C",
              padding: 16,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <ThemedText
              type="title"
              style={{ color: "white", marginBottom: 12 }}
            >
              {taller.nombre.toUpperCase()}
            </ThemedText>
            <Image
              source={{ uri: taller.imagenLogo }}
              style={{
                width: "100%",
                height: 180,
                marginBottom: 12,
                borderRadius: 12,
              }}
            />
            <ThemedText style={{ color: "white", marginBottom: 8 }}>
              {taller.descripcion}
            </ThemedText>
            <ThemedText
              style={{ color: "white", fontWeight: "bold", marginBottom: 4 }}
            >
              Dirección
            </ThemedText>
            <ThemedText style={{ color: "white", marginBottom: 20 }}>
              {taller.ubicacion}
            </ThemedText>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <ThemedButton>Mi Agenda</ThemedButton>
              <ThemedButton>Turnos</ThemedButton>
              <ThemedButton>Cambiar Descripción</ThemedButton>
              <ThemedButton>Mis servicios</ThemedButton>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}
