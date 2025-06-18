import { useState } from "react";
import {
  View,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";

export default function FinalizarTurnoScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const { id, fecha, hora, vehiculo } = useLocalSearchParams();

  const [descripcionTrabajo, setDescripcionTrabajo] = useState("");
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [subiendo, setSubiendo] = useState(false);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!resultado.canceled) {
      setImagenes((prev) => [...prev, ...resultado.assets]);
    }
  };

  const finalizarTurno = async () => {
    if (!descripcionTrabajo) {
      Alert.alert(
        "Descripción requerida",
        "Por favor completa la descripción del trabajo."
      );
      return;
    }

    const formData = new FormData();
    formData.append("descripcionTrabajo", descripcionTrabajo);

    imagenes.forEach((img, index) => {
      formData.append("imagenes", {
        uri: img.uri,
        name: `foto_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    try {
      setSubiendo(true);
      await fixManagerApi.put(`/turnos/${id}/finalizar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Turno finalizado con éxito");
      router.back();
    } catch (error) {
      console.error("Error al finalizar turno", error);
      Alert.alert("Error", "No se pudo finalizar el turno");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor }}>
      <Stack.Screen options={{ title: "Finalizar Turno" }} />

      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <ThemedText style={styles.label}>Vehículo</ThemedText>
        <ThemedText style={styles.value}>{vehiculo}</ThemedText>

        <ThemedText style={styles.label}>Fecha</ThemedText>
        <ThemedText style={styles.value}>{fecha}</ThemedText>

        <ThemedText style={styles.label}>Hora</ThemedText>
        <ThemedText style={styles.value}>{hora}</ThemedText>

        <ThemedText style={styles.label}>Descripción del trabajo</ThemedText>
        <ThemedTextInput
          placeholder="Detalle del trabajo realizado"
          multiline
          numberOfLines={4}
          value={descripcionTrabajo}
          onChangeText={setDescripcionTrabajo}
        />

        <ThemedButton onPress={seleccionarImagen}>
          Agregar Imágenes
        </ThemedButton>

        {imagenes.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginTop: 10, gap: 10 }}
          >
            {imagenes.map((img, i) => (
              <Pressable key={i}>
                <Image
                  source={{ uri: img.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                  }}
                />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={{ marginTop: 20 }}>
          <ThemedButton onPress={finalizarTurno} disabled={subiendo}>
            {subiendo ? "Finalizando..." : "Finalizar Turno"}
          </ThemedButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
  },
  label: {
    color: "white",
    fontWeight: "bold",
    marginTop: 12,
  },
  value: {
    color: "white",
    marginBottom: 8,
  },
});
