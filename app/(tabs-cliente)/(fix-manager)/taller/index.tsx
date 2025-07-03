import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, ScrollView, Image, ActivityIndicator } from "react-native";
import { Stack, router } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";

import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { getBaseImageUrl } from "@/presentation/theme/hooks/getBaseImageUrl";

import CustomButton from "@/presentation/theme/components/CustomButton";

export default function TallerScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuthStore();
  const [taller, setTaller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTaller = async () => {
        setLoading(true);
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
    }, [user?.id])
  );

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

  if (!taller) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ThemedText>No se pudo cargar el taller</ThemedText>
      </View>
    );
  }

  const imageUrl = `${getBaseImageUrl()}${taller.imagenLogo}`;
  console.log("URL de la imagen del taller:", imageUrl);

  return (
    <>
      <Stack.Screen options={{ title: "Mi Taller" }} />
      <ScrollView style={{ flex: 1, padding: 20, backgroundColor }}>
        <View
          style={{
            backgroundColor: "#1F2E3C",
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <ThemedText type="title" style={{ color: "white", marginBottom: 12 }}>
            {taller.nombre?.toUpperCase() ?? "TALLER SIN NOMBRE"}
          </ThemedText>

          <Image
            source={{ uri: imageUrl }}
            style={{ width: 200, height: 100 }}
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
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <CustomButton
              label="Mi Agenda"
              onPress={() =>
                router.push(
                  "/(tabs-cliente)/(fix-manager)/taller/TurnosPendientesScreen"
                )
              }
            />
            <CustomButton
              label="Turnos"
              onPress={() =>
                router.push("/(tabs-cliente)/(fix-manager)/taller/crearTurno")
              }
            />
            <CustomButton
              label="Editar Taller"
              onPress={() =>
                router.push(
                  "/(tabs-cliente)/(fix-manager)/taller/editarTallerScreen"
                )
              }
            />
            <CustomButton
              label="Mis servicios"
              onPress={() =>
                router.push("/(tabs-cliente)/(fix-manager)/taller/misServicios")
              }
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
