import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props {
  marca: string;
  modelo: string;
  patente: string;
  anio: number;
  onEditar?: () => void;
}

export const VehiculoCard = ({
  marca,
  modelo,
  patente,
  anio,
  onEditar,
}: Props) => {
  const backgroudColor = useThemeColor({}, "cardBackground");
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: backgroudColor,
        borderColor: "#A5AAB1",
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Columna izquierda */}
      <View style={{ flex: 1 }}>
        <ThemedText type="subtitle" style={{ marginBottom: 4 }}>
          {marca} {modelo} - {anio}
        </ThemedText>
        <ThemedText>Patente: {patente}</ThemedText>
      </View>

      {/* Columna derecha: icono */}
      <TouchableOpacity onPress={onEditar} style={{ marginLeft: 12 }}>
        <Ionicons name="create-outline" size={24} color="#5CC6FF" />
      </TouchableOpacity>
    </View>
  );
};
