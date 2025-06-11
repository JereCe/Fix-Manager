import { View, TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";

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

export const TurnoCardTaller = ({
  turno,
  onCancel,
}: {
  turno: TurnoPendienteTaller;
  onCancel: (turnoId: number) => void;
}) => {
  const cancelarTurno = async () => {
    try {
      await fixManagerApi.put(`/turnos/${turno.id}/cancelar-taller`);
      onCancel(turno.id);
    } catch (error) {
      console.error("Error al cancelar turno:", error);
    }
  };

  const confirmarCancelacion = () => {
    Alert.alert(
      "Cancelar turno",
      "¿Estás seguro de que querés cancelar este turno?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: cancelarTurno,
        },
      ]
    );
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
      {/* Fecha + botón de cancelar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText style={{ color: "white", fontWeight: "bold" }}>
          Fecha: {turno.fecha}
        </ThemedText>
        <TouchableOpacity
          onPress={confirmarCancelacion}
          style={{
            backgroundColor: "#FF4C4C",
            padding: 6,
            borderRadius: 6,
          }}
        >
          <Ionicons name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <ThemedText style={{ color: "white" }}>Hora: {turno.hora}</ThemedText>
      <ThemedText style={{ color: "white" }}>Estado: {turno.estado}</ThemedText>
      <ThemedText style={{ color: "white" }}>
        Disponibilidad: {turno.disponibilidad}
      </ThemedText>
      <ThemedText style={{ color: "white" }}>
        Vehículo: {turno.vehiculoMarca} {turno.vehiculoModelo}
      </ThemedText>
      <ThemedText style={{ color: "white" }}>
        Patente: {turno.vehiculoPatente}
      </ThemedText>

      {/* Botón Finalizar (solo visual por ahora) */}
      <TouchableOpacity
        onPress={() => {}}
        style={{
          marginTop: 10,
          backgroundColor: "#5CC6FF",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <ThemedText style={{ color: "white", fontWeight: "bold" }}>
          Finalizar Turno
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};
