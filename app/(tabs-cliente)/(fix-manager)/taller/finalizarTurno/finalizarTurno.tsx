import { useState } from "react";
import {
  View,
  Alert,
  Image,
  ScrollView,
  TextInput,
  Button,
  Text,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";

export default function FinalizarTurnoScreen() {
  const backgroundColor = useThemeColor({}, "background");
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

      <View style={styles.card}>
        <ThemedText style={styles.label}>Vehículo</ThemedText>
        <Text style={styles.value}>{vehiculo}</Text>

        <ThemedText style={styles.label}>Fecha</ThemedText>
        <Text style={styles.value}>{fecha}</Text>

        <ThemedText style={styles.label}>Hora</ThemedText>
        <Text style={styles.value}>{hora}</Text>

        <ThemedText style={styles.label}>Descripción del trabajo</ThemedText>
        <TextInput
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Detalle del trabajo realizado"
          value={descripcionTrabajo}
          onChangeText={setDescripcionTrabajo}
        />

        <Button title="Agregar Imágenes" onPress={seleccionarImagen} />
        <View style={{ marginVertical: 10 }}>
          {imagenes.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img.uri }}
              style={{ width: 100, height: 100, marginVertical: 4 }}
            />
          ))}
        </View>

        <Button
          title={subiendo ? "Finalizando..." : "Finalizar Turno"}
          onPress={finalizarTurno}
          disabled={subiendo}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2E3C",
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
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
});
