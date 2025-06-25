import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
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

export default function TurnosHoyYManianaScreen() {
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");

  const [turnosHoy, setTurnosHoy] = useState<TurnoPendienteTaller[]>([]);
  const [turnosManiana, setTurnosManiana] = useState<TurnoPendienteTaller[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const { data } = await fixManagerApi.get(
          `/turnos/taller/${user?.id}/pendientes`
        );

        const hoy = new Date();
        const maniana = new Date();
        maniana.setDate(hoy.getDate() + 1);

        const formatoFecha = (fecha: Date) => fecha.toISOString().split("T")[0];

        const hoyStr = formatoFecha(hoy);
        const manianaStr = formatoFecha(maniana);

        const turnosDeHoy = data.filter((t: any) => t.fecha === hoyStr);
        const turnosDeManiana = data.filter((t: any) => t.fecha === manianaStr);

        if (turnosDeHoy.length === 0 && turnosDeManiana.length === 0) {
          Alert.alert("Sin turnos", "No hay turnos para hoy ni para mañana.", [
            { text: "Aceptar", onPress: () => router.back() },
          ]);
          return;
        }

        const ordenar = (arr: any[]) =>
          arr.sort((a, b) => {
            const horaA = new Date(`${a.fecha}T${a.hora}`);
            const horaB = new Date(`${b.fecha}T${b.hora}`);
            return horaA.getTime() - horaB.getTime();
          });

        setTurnosHoy(ordenar(turnosDeHoy));
        setTurnosManiana(ordenar(turnosDeManiana));
      } catch (error) {
        console.error("Error al obtener turnos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [user?.id]);

  const cancelarTurno = (turnoId: number) => {
    setTurnosHoy((prev) => prev.filter((t) => t.id !== turnoId));
    setTurnosManiana((prev) => prev.filter((t) => t.id !== turnoId));
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#5CC6FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor, padding: 16 }}>
      <Stack.Screen options={{ title: "Turnos por Día" }} />

      <Text style={styles.seccionTitulo}>Turnos de Hoy</Text>
      {turnosHoy.length === 0 ? (
        <Text style={styles.mensajeVacio}>No hay turnos para hoy.</Text>
      ) : (
        <FlatList
          data={turnosHoy}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TurnoCardTaller turno={item} onCancel={cancelarTurno} />
          )}
        />
      )}

      <Text style={[styles.seccionTitulo, { marginTop: 30 }]}>
        Turnos de Mañana
      </Text>
      {turnosManiana.length === 0 ? (
        <Text style={styles.mensajeVacio}>No hay turnos para mañana.</Text>
      ) : (
        <FlatList
          data={turnosManiana}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TurnoCardTaller turno={item} onCancel={cancelarTurno} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  seccionTitulo: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mensajeVacio: {
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
});
