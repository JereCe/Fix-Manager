import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { Checkbox } from "react-native-paper";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import CustomWideButton from "@/presentation/theme/components/CustomWideButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";

const opciones = [
  "MECANICA_GENERAL",
  "ELECTRICIDAD",
  "AIRE_ACONDICIONADO",
  "NEUMATICOS",
  "CHAPA_PINTURA",
];

export default function MisServiciosScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const { user } = useAuthStore();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const { data } = await fixManagerApi.get(
          `/talleres/${user?.id}/taller`
        );
        if (data?.tipoReparaciones) {
          setSeleccionados(data.tipoReparaciones);
        }
      } catch (err) {
        console.log("Error al cargar tipos de reparación", err);
      }
    };

    obtenerServicios();
  }, [user?.id]);

  const toggleSeleccion = (tipo: string) => {
    setSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const guardar = async () => {
    try {
      await fixManagerApi.put(
        `/talleres/${user?.id}/tipos-reparacion`,
        seleccionados
      );
      Alert.alert("Éxito", "Servicios actualizados correctamente");
      router.back(); // ← Vuelve a la pantalla anterior
    } catch (error) {
      console.error("Error al guardar servicios", error);
      Alert.alert("Error", "No se pudo guardar los servicios");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor, padding: 16 }}>
      <Stack.Screen options={{ title: "Mis Servicios" }} />
      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 16,
          padding: 20,
        }}
      >
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "white",
            marginBottom: 16,
          }}
        >
          Selecciona los servicios que ofrece tu taller:
        </ThemedText>

        {opciones.map((tipo) => (
          <Checkbox.Item
            key={tipo}
            label={tipo.replace("_", " ")}
            status={seleccionados.includes(tipo) ? "checked" : "unchecked"}
            onPress={() => toggleSeleccion(tipo)}
            labelStyle={{ color: "white" }}
          />
        ))}

        <View style={{ marginTop: 20 }}>
          <CustomWideButton onPress={guardar}>
            Guardar Servicios
          </CustomWideButton>
        </View>
      </View>
    </ScrollView>
  );
}
