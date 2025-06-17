import { useEffect, useState } from "react";
import { View, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const EditarVehiculoScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  const inputBG = useThemeColor({}, "textInputBG");

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    patente: "",
    anio: "",
  });

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const { data } = await fixManagerApi.get(`/vehiculos/${id}`);
        setForm({
          marca: data.marca,
          modelo: data.modelo,
          patente: data.patente,
          anio: data.anio?.toString() || "",
        });
      } catch (error) {
        console.log("Error cargando vehículo:", error);
        Alert.alert("Error", "No se pudo cargar el vehículo");
      }
    };

    fetchVehiculo();
  }, [id]);

  const onSave = async () => {
    const { marca, modelo, patente, anio } = form;

    if (!marca || !modelo || !patente || !anio) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (!/^[0-9]{4}$/.test(anio)) {
      Alert.alert("Error", "El año debe ser un número de 4 dígitos");
      return;
    }

    try {
      await fixManagerApi.put(`/vehiculos/actualizar/${id}`, {
        ...form,
        anio: Number(anio),
        usuarioId: user?.id,
      });

      Alert.alert("Éxito", "Vehículo actualizado correctamente");
      router.replace("/(tabs-cliente)/(fix-manager)/vehiculos");
    } catch (error) {
      console.log("Error guardando:", error);
      Alert.alert("Error", "No se pudo actualizar el vehículo");
    }
  };

  const onCancel = () => {
    router.replace("/(tabs-cliente)/(fix-manager)/vehiculos");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <Stack.Screen options={{ title: "Editar Vehículo" }} />

        <View
          style={{
            backgroundColor: inputBG,
            borderRadius: 12,
            padding: 16,
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

          <ThemedButton onPress={onSave}>Guardar Cambios</ThemedButton>
          <View style={{ marginTop: 10 }}>
            <ThemedButton onPress={onCancel}>Cancelar</ThemedButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default EditarVehiculoScreen;
