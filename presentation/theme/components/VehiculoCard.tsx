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
  onHistorial?: () => void;
  onEliminar?: () => void;
}

export const VehiculoCard = ({
  marca,
  modelo,
  patente,
  anio,
  onEditar,
  onHistorial,
  onEliminar,
}: Props) => {
  const backgroundColor = useThemeColor({}, "cardBackground");

  return (
    <View
      style={{
        backgroundColor,
        borderColor: "#A5AAB1",
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
      }}
    >
      {/* Parte superior: texto + ícono editar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1, marginLeft: 8 }}>
          <ThemedText style={{ marginBottom: 2, fontSize: 24, color: "white" }}>
            {marca} {modelo}
          </ThemedText>
          <ThemedText style={{ marginBottom: 2, fontSize: 20, color: "white" }}>
            {anio}
          </ThemedText>
          <ThemedText style={{ fontSize: 16, color: "white" }}>
            {patente}
          </ThemedText>
        </View>

        <TouchableOpacity onPress={onEditar}>
          <Ionicons name="create-outline" size={24} color="#5CC6FF" />
        </TouchableOpacity>
      </View>

      {/* Botones icónicos */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 14,
        }}
      >
        <TouchableOpacity
          onPress={onHistorial}
          style={{
            flex: 1,
            marginRight: 8,
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#9BA1A6",
          }}
        >
          <Ionicons name="document-text-outline" size={26} color="#5CC6FF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onEliminar}
          style={{
            flex: 1,
            marginLeft: 8,
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#9BA1A6",
          }}
        >
          <Ionicons name="trash-outline" size={26} color="#5CC6FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
