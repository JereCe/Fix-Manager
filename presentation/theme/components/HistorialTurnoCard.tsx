import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { router } from "expo-router";

interface HistorialTurno {
  id: number;
  fecha: string;
  hora: string;
  tallerNombre: string;
  tallerUbicacion: string;
  descripcionTrabajo: string;
}

export const HistorialTurnoCard = ({
  id,
  fecha,
  hora,
  tallerNombre,
  tallerUbicacion,
  descripcionTrabajo,
}: HistorialTurno) => {
  const irADetalle = () => {
    router.push({
      pathname: "/(tabs-cliente)/(fix-manager)/turnos/detalle/[id]",
      params: { id: id.toString() },
    });
  };

  return (
    <View
      style={{
        backgroundColor: "#1F2E3C",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <ThemedText style={{ color: "white", fontWeight: "bold" }}>
        Fecha: {fecha}
      </ThemedText>
      <ThemedText style={{ color: "white" }}>Hora: {hora}</ThemedText>
      <ThemedText style={{ color: "white" }}>Taller: {tallerNombre}</ThemedText>
      <ThemedText style={{ color: "white" }}>
        Dirección: {tallerUbicacion}
      </ThemedText>
      <ThemedText style={{ color: "white" }}>
        Trabajo: {descripcionTrabajo}
      </ThemedText>

      <TouchableOpacity
        onPress={irADetalle}
        style={{
          marginTop: 10,
          backgroundColor: "#5CC6FF",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <ThemedText style={{ color: "white", fontWeight: "bold" }}>
          Ver más detalles
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};
