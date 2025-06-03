// components/VehiculoCard.tsx
import { View } from "react-native";
import { ThemedText } from "@/presentation/theme/components/ThemedText";

interface Props {
  marca: string;
  modelo: string;
  patente: string;
}

export const VehiculoCard = ({ marca, modelo, patente }: Props) => {
  return (
    <View
      style={{
        marginBottom: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        backgroundColor: "#1F2A37",
      }}
    >
      <ThemedText type="subtitle">
        {marca} {modelo}
      </ThemedText>
      <ThemedText style={{ color: "#A5AAB1" }}>{patente}</ThemedText>
    </View>
  );
};
