import { useState } from "react";
import { View, Alert, Platform } from "react-native";
import { Stack, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import CustomSmallButton from "@/presentation/theme/components/CustomSmallButton";

const CrearTurnoTallerScreen = () => {
  const backgroundColor = useThemeColor({}, "background");

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
    <View
      style={{
        flex: 1,
        backgroundColor,
        padding: 20,
        paddingTop: 20,
      }}
    >
      <Stack.Screen options={{ title: "Crear Turno" }} />

      <ThemedText
        style={{ color: "white", textAlign: "center", marginBottom: 4 }}
      >
        Seleccione fecha
      </ThemedText>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <CustomSmallButton onPress={() => setMostrarFecha(true)}>
          Fecha
        </CustomSmallButton>
      </View>

      <ThemedText
        style={{ color: "white", textAlign: "center", marginBottom: 4 }}
      >
        Seleccione hora
      </ThemedText>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <CustomSmallButton onPress={() => setMostrarHora(true)}>
          Hora
        </CustomSmallButton>
      </View>

      {fechaSeleccionada && (
        <ThemedText
          style={{ marginVertical: 10, color: "white", textAlign: "center" }}
        >
          Fecha seleccionada: {fecha.toLocaleDateString()}
        </ThemedText>
      )}
      {horaSeleccionada && (
        <ThemedText
          style={{ marginBottom: 40, color: "white", textAlign: "center" }}
        >
          Hora seleccionada:{" "}
          {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </ThemedText>
      )}

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
        <CustomSmallButton onPress={crearTurno}>Crear Turno</CustomSmallButton>
        <CustomSmallButton onPress={() => router.back()}>
          Cancelar
        </CustomSmallButton>
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
