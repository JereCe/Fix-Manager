import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { Stack } from "expo-router";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { TurnoCardTaller } from "@/presentation/theme/components/TurnoCardTaller";

interface TurnoPendienteTaller {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  disponibilidad: string;
  vehiculoMarca: string;
  vehiculoModelo: string;
  vehiculoPatente: string;
}

export default function TurnosPendientesTallerScreen() {
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  const [turnos, setTurnos] = useState<TurnoPendienteTaller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const { data } = await fixManagerApi.get(
          `/turnos/taller/${user?.id}/pendientes`
        );

        console.log("Respuesta turnos pendientes:", data);

        if (Array.isArray(data)) {
          const turnosOrdenados = data.sort((a: any, b: any) => {
            const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
            const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
            return fechaHoraA.getTime() - fechaHoraB.getTime();
          });

          setTurnos(turnosOrdenados);
        } else {
          console.error("La respuesta del backend no es un array:", data);
          setTurnos([]);
        }
      } catch (error) {
        console.error("Error al obtener turnos pendientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
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
    <View style={{ flex: 1, padding: 16, backgroundColor }}>
      <Stack.Screen options={{ title: "Turnos Pendientes" }} />
      {turnos.length === 0 ? (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          No hay turnos pendientes.
        </Text>
      ) : (
        <FlatList
          data={turnos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TurnoCardTaller
              turno={item}
              onCancel={(turnoId) =>
                setTurnos((prev) => prev.filter((t) => t.id !== turnoId))
              }
            />
          )}
        />
      )}
    </View>
  );
}
