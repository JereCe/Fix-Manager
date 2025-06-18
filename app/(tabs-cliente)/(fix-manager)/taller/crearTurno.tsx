import { useState } from "react";
import { View, Alert, Platform } from "react-native";
import { Stack, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import CustomWideButton from "@/presentation/theme/components/CustomWideButton";

const CrearTurnoTallerScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");

  const { user } = useAuthStore();

  const [fecha, setFecha] = useState(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState(false);

  const onChangeFecha = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFecha(selectedDate);
      setFechaSeleccionada(true);
    }
    setMostrarFecha(false);
  };

  const onChangeHora = (_: any, selectedTime?: Date) => {
    if (selectedTime) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setHours(selectedTime.getHours());
      nuevaFecha.setMinutes(selectedTime.getMinutes());
      setFecha(nuevaFecha);
      setHoraSeleccionada(true);
    }
    setMostrarHora(false);
  };

  const crearTurno = async () => {
    try {
      const datos = {
        fecha: fecha.toISOString().split("T")[0],
        hora: fecha.toTimeString().split(":").slice(0, 2).join(":"),
      };

      await fixManagerApi.post(`/turnos/taller/${user?.id}/crear`, datos);

      Alert.alert("Turno creado con éxito");
      router.push("/(tabs-cliente)/(fix-manager)/taller");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo crear el turno");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor, padding: 20 }}>
      <Stack.Screen options={{ title: "Crear Turno" }} />

      <View
        style={{
          backgroundColor: cardBackground,
          padding: 20,
          borderRadius: 16,
        }}
      >
        <ThemedText style={{ color: "white", marginBottom: 10 }}>
          Seleccione fecha
        </ThemedText>
        <CustomWideButton onPress={() => setMostrarFecha(true)}>
          Seleccionar fecha
        </CustomWideButton>

        <View style={{ height: 20 }} />

        <ThemedText style={{ color: "white", marginBottom: 10 }}>
          Seleccione hora
        </ThemedText>
        <CustomWideButton onPress={() => setMostrarHora(true)}>
          Seleccionar hora
        </CustomWideButton>

        {fechaSeleccionada && (
          <ThemedText
            style={{ marginTop: 20, color: "white", textAlign: "center" }}
          >
            Fecha: {fecha.toLocaleDateString()}
          </ThemedText>
        )}
        {horaSeleccionada && (
          <ThemedText
            style={{ marginBottom: 20, color: "white", textAlign: "center" }}
          >
            Hora:{" "}
            {fecha.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </ThemedText>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            paddingHorizontal: 10,
          }}
        >
          <CustomWideButton onPress={() => router.back()}>
            Cancelar
          </CustomWideButton>
          <CustomWideButton onPress={crearTurno}>Crear Turno</CustomWideButton>
        </View>
      </View>

      {mostrarFecha && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeFecha}
        />
      )}

      {mostrarHora && (
        <DateTimePicker
          value={fecha}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeHora}
        />
      )}
    </View>
  );
};

export default CrearTurnoTallerScreen;
