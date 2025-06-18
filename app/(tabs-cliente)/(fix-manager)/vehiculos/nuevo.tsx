import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

const NuevoVehiculoScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const inputBG = useThemeColor({}, "textInputBG");
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    patente: "",
    anio: "",
  });

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
      setIsPosting(true);
      await fixManagerApi.post("/vehiculos/crear", {
        ...form,
        anio: Number(anio),
        usuarioId: user?.id, // ✅ ID necesario para relacionar el vehículo
      });

      Alert.alert("Éxito", "Vehículo creado correctamente");
      router.replace("/(tabs-cliente)/(fix-manager)/vehiculos");
    } catch (error) {
      console.log("Error guardando:", error);
      Alert.alert("Error", "No se pudo guardar el vehículo");
    } finally {
      setIsPosting(false);
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
        <Stack.Screen options={{ title: "Nuevo Vehículo" }} />

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

          <ThemedButton onPress={onSave} disabled={isPosting}>
            Crear Vehículo
          </ThemedButton>

          <View style={{ marginTop: 10 }}>
            <ThemedButton onPress={onCancel}>Cancelar</ThemedButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default NuevoVehiculoScreen;
