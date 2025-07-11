import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Alert } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { HistorialTurnoCard } from "@/presentation/theme/components/HistorialTurnoCard";

interface HistorialTurnoDTO {
  id: number;
  fecha: string;
  hora: string;
  descripcionTrabajo: string;
  tallerNombre: string;
  tallerUbicacion: string;
}

export default function HistorialVehiculoScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { id } = useLocalSearchParams();
  const [historial, setHistorial] = useState<HistorialTurnoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const { data } = await fixManagerApi.get(
          `/turnos/vehiculo/${id}/historial`
        );

        if (!data || data.length === 0) {
          Alert.alert(
            "Sin historial",
            "Este vehículo no tiene historial de turnos.",
            [{ text: "Aceptar", onPress: () => router.back() }]
          );
          return;
        }

        const historialOrdenado = data.sort((a: any, b: any) => {
          const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
          const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
          return fechaHoraB.getTime() - fechaHoraA.getTime(); // Más reciente primero
        });

        setHistorial(historialOrdenado);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [id]);

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
    <View style={{ flex: 1, padding: 16, backgroundColor }}>
      <Stack.Screen options={{ title: "Historial del Vehículo" }} />

      <FlatList
        data={historial}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HistorialTurnoCard {...item} />}
      />
    </View>
  );
}
