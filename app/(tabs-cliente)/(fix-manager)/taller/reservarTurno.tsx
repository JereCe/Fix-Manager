import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { getBaseImageUrl } from "@/presentation/theme/hooks/getBaseImageUrl";

import CustomSmallButton from "@/presentation/theme/components/CustomSmallButton";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

export default function ReservarTurnoScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { id: tallerId } = useLocalSearchParams();
  const baseUrl = getBaseImageUrl();
  const { user } = useAuthStore();

  const [taller, setTaller] = useState<any>(null);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [turnos, setTurnos] = useState<any[]>([]);
  const [vehiculoId, setVehiculoId] = useState<number | undefined>(undefined);
  const [turnoId, setTurnoId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchDatos = async () => {
        try {
          setLoading(true);
          const [tallerRes, vehiculoRes, turnosRes] = await Promise.all([
            fixManagerApi.get(`/talleres/${tallerId}/taller`),
            fixManagerApi.get(`/vehiculos/usuario/${user?.id}`),
            fixManagerApi.get(`/turnos/disponibles?tallerId=${tallerId}`),
          ]);

          setTaller(tallerRes.data);
          setVehiculos(vehiculoRes.data);
          setTurnos(turnosRes.data);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          Alert.alert("Error", "No se pudo cargar la información del taller");
        } finally {
          setLoading(false);
        }
      };

      fetchDatos();
    }, [tallerId, user?.id])
  );

  const reservarTurno = async () => {
    if (!vehiculoId || !turnoId) {
      Alert.alert("Error", "Seleccioná un turno y un vehículo");
      return;
    }
    try {
      await fixManagerApi.put(
        `/turnos/${turnoId}/reservar?clienteId=${user?.id}&vehiculoId=${vehiculoId}`
      );
      Alert.alert("Éxito", "Turno reservado correctamente");
      router.back();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert("Error", "No se pudo reservar el turno");
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color="#5CC6FF" />
      </View>
    );
  }

  if (!taller) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ThemedText>No se pudo cargar el taller</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor }}>
      <Stack.Screen options={{ title: "Reservar Turno" }} />

      <View
        style={{
          backgroundColor: "#1F2E3C",
          padding: 16,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <ThemedText type="title" style={{ color: "white", marginBottom: 12 }}>
          {taller.nombre?.toUpperCase() ?? "TALLER SIN NOMBRE"}
        </ThemedText>

        <Image
          source={{ uri: `${baseUrl}${taller.imagenLogo}` }}
          style={{ width: 200, height: 100, marginBottom: 12 }}
        />

        <ThemedText style={{ color: "white", marginBottom: 8 }}>
          {taller.descripcion}
        </ThemedText>
        <ThemedText
          style={{ color: "white", fontWeight: "bold", marginBottom: 4 }}
        >
          Dirección
        </ThemedText>
        <ThemedText style={{ color: "white", marginBottom: 16 }}>
          {taller.ubicacion}
        </ThemedText>

        <ThemedText style={{ color: "white", marginBottom: 4 }}>
          Selecciona un turno
        </ThemedText>
        <View
          style={{ backgroundColor: "#fff", width: "100%", borderRadius: 6 }}
        >
          <Picker
            selectedValue={turnoId ?? undefined}
            onValueChange={(itemValue: number) => setTurnoId(itemValue)}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Elige un turno..." value={undefined} />
            {turnos.map((t) => (
              <Picker.Item
                key={t.id}
                label={`${t.fecha} - ${t.hora}`}
                value={t.id}
              />
            ))}
          </Picker>
        </View>

        <ThemedText style={{ color: "white", marginTop: 12, marginBottom: 4 }}>
          Selecciona un vehículo
        </ThemedText>
        <View
          style={{ backgroundColor: "#fff", width: "100%", borderRadius: 6 }}
        >
          <Picker
            selectedValue={vehiculoId ?? undefined}
            onValueChange={(itemValue: number) => setVehiculoId(itemValue)}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Elige un vehículo..." value={undefined} />
            {vehiculos.map((v) => (
              <Picker.Item
                key={v.id}
                label={`${v.marca} ${v.modelo} - ${v.patente}`}
                value={v.id}
              />
            ))}
          </Picker>
        </View>

        <View
          style={{
            marginTop: 20,
            gap: 12,
            width: "100%",
            alignItems: "center",
          }}
        >
          <CustomSmallButton onPress={reservarTurno}>
            Reservar
          </CustomSmallButton>
          <CustomSmallButton onPress={() => router.back()}>
            Cancelar
          </CustomSmallButton>
        </View>
      </View>
    </ScrollView>
  );
}
