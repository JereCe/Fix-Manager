import { View, TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";

interface TurnoReservado {
  id: number;
  fecha: string;
  hora: string;
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

export const TurnoCard = ({
  turno,
  onCancel,
}: {
  turno: TurnoReservado;
  onCancel: (turnoId: number) => void;
}) => {
  const cancelarTurno = async () => {
    try {
      await fixManagerApi.put(`/turnos/${turno.id}/cancelar-cliente`);
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
      <ThemedText style={{ color: "white" }}>
        Taller: {turno.taller.nombre}
      </ThemedText>
      <ThemedText style={{ color: "white" }}>
        Dirección: {turno.taller.ubicacion}
      </ThemedText>
      <ThemedText style={{ color: "white" }}>
        Vehículo: {turno.vehiculo.marca} {turno.vehiculo.modelo}
      </ThemedText>
      <ThemedText style={{ color: "white" }}>
        Patente: {turno.vehiculo.patente}
      </ThemedText>
    </View>
  );
};
