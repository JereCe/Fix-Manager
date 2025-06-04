import { useState } from "react";
import { View, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

const NuevoVehiculoScreen = () => {
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  const inputBG = useThemeColor({}, "textInputBG");

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    patente: "",
    anio: "",
  });

  const onSave = async () => {
    try {
      await fixManagerApi.post("/vehiculos/crear", {
        ...form,
        anio: Number(form.anio),
        usuarioId: user?.id,
      });

      Alert.alert("Éxito", "Vehículo creado correctamente");

      setForm({ marca: "", modelo: "", patente: "", anio: "" });
      router.replace("/(tabs-cliente)/(fix-manager)/vehiculos");
    } catch (error) {
      console.log("Error guardando:", error);
      Alert.alert("Error", "No se pudo guardar el vehículo");
    }
  };

  const onCancel = () => {
    router.replace("/(tabs-cliente)/(fix-manager)/vehiculos");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Nuevo Vehículo" }} />
      <View style={{ padding: 20, backgroundColor, flex: 1 }}>
        <View
          style={{
            backgroundColor: inputBG,
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            paddingBottom: 24,
          }}
        >
          <View style={{ marginBottom: 12 }}>
            <ThemedText style={{ marginBottom: 4, color: "white" }}>
              Marca
            </ThemedText>
            <ThemedTextInput
              placeholder="Marca"
              value={form.marca}
              icon="car-outline"
              onChangeText={(text) => setForm({ ...form, marca: text })}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <ThemedText style={{ marginBottom: 4, color: "white" }}>
              Modelo
            </ThemedText>
            <ThemedTextInput
              placeholder="Modelo"
              value={form.modelo}
              icon="build-outline"
              onChangeText={(text) => setForm({ ...form, modelo: text })}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <ThemedText style={{ marginBottom: 4, color: "white" }}>
              Patente
            </ThemedText>
            <ThemedTextInput
              placeholder="Patente"
              value={form.patente}
              icon="barcode-outline"
              onChangeText={(text) => setForm({ ...form, patente: text })}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <ThemedText style={{ marginBottom: 4, color: "white" }}>
              Año
            </ThemedText>
            <ThemedTextInput
              placeholder="Año"
              keyboardType="numeric"
              value={form.anio}
              icon="calendar-outline"
              onChangeText={(text) => setForm({ ...form, anio: text })}
            />
          </View>

          <ThemedButton onPress={onSave}>Crear Vehículo</ThemedButton>
          <View style={{ marginTop: 10 }}>
            <ThemedButton onPress={onCancel}>Cancelar</ThemedButton>
          </View>
        </View>
      </View>
    </>
  );
};

export default NuevoVehiculoScreen;
