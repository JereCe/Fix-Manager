import { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { TurnoCard } from "@/presentation/theme/components/TurnoCard";

interface TurnoReservado {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  taller: {
    nombre: string;
    ubicacion: string;
  };
  vehiculo: {
    marca: string;
    modelo: string;
    patente: string;
  };
}

export default function MisTurnosScreen() {
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  const [turnos, setTurnos] = useState<TurnoReservado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const { data } = await fixManagerApi.get(`/turnos/cliente/${user?.id}`);

        if (!data || data.length === 0) {
          Alert.alert(
            "Sin turnos",
            "No tenés turnos reservados por el momento.",
            [
              {
                text: "Aceptar",
                onPress: () => router.back(),
              },
            ]
          );
          setTurnos([]);
          return;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Para comparar solo fechas, sin hora

        const turnosAdaptados: TurnoReservado[] = data
          .filter((t: any) => {
            if (t.estado === "FINALIZADO") return false;

            const turnoFecha = new Date(t.fecha);
            turnoFecha.setHours(0, 0, 0, 0); // Igualar formato

            return turnoFecha >= hoy; // Mostrar solo desde hoy en adelante
          })
          .map((t: any) => ({
            id: t.id,
            fecha: t.fecha,
            hora: t.hora,
            estado: t.estado,
            taller: {
              nombre: t.tallerNombre,
              ubicacion: t.tallerUbicacion,
            },
            vehiculo: {
              marca: t.vehiculoMarca,
              modelo: t.vehiculoModelo,
              patente: t.vehiculoPatente,
            },
          }));

        turnosAdaptados.sort((a, b) => {
          const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
          const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
          return fechaHoraA.getTime() - fechaHoraB.getTime();
        });

        setTurnos(turnosAdaptados);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
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
      <Stack.Screen options={{ title: "Mis Turnos" }} />
      <FlatList
        data={turnos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TurnoCard
            turno={item}
            onCancel={(turnoId) =>
              setTurnos((prev) => prev.filter((t) => t.id !== turnoId))
            }
          />
        )}
      />
    </View>
  );
}
