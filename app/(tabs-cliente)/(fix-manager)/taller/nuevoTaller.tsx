import { useState } from "react";
import { View, Alert, Image, Button, ScrollView } from "react-native";
import { Stack, router } from "expo-router";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";

export default function NuevoTallerScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
  });

  const [imagen, setImagen] = useState<null | {
    uri: string;
    name: string;
    type: string;
  }>(null);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const asset = resultado.assets[0];
      const localUri = asset.uri;
      const fileName = localUri.split("/").pop() ?? "imagen.jpg";
      const fileType = asset.type ?? "image";

      setImagen({
        uri: localUri,
        name: fileName,
        type: `${fileType}/jpeg`,
      });
    }
  };

  const guardarTaller = async () => {
    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("ubicacion", form.ubicacion);

    if (imagen) {
      formData.append("imagen", {
        uri: imagen.uri,
        name: imagen.name,
        type: imagen.type,
      } as any);
    }

    try {
      await fixManagerApi.post(`/talleres/${user?.id}/crear-taller`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Taller creado con éxito");
      router.replace("/(tabs-cliente)/(fix-manager)/taller");
    } catch (error) {
      console.log("Error al crear taller", error);
      Alert.alert("Error", "No se pudo crear el taller");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor }}>
      <Stack.Screen options={{ title: "Crear Taller" }} />
      <View
        style={{
          backgroundColor: "#1F2E3C",
          padding: 16,
          borderRadius: 16,
          marginTop: 40,
        }}
      >
        <ThemedText
          type="title"
          style={{ marginBottom: 16, color: "white", textAlign: "center" }}
        >
          Crear taller
        </ThemedText>

        <ThemedTextInput
          placeholder="Nombre del taller"
          icon="business-outline"
          value={form.nombre}
          onChangeText={(value) => setForm({ ...form, nombre: value })}
        />
        <ThemedTextInput
          placeholder="Descripción"
          icon="document-text-outline"
          value={form.descripcion}
          onChangeText={(value) => setForm({ ...form, descripcion: value })}
        />
        <ThemedTextInput
          placeholder="Dirección"
          icon="location-outline"
          value={form.ubicacion}
          onChangeText={(value) => setForm({ ...form, ubicacion: value })}
        />

        <Button title="Seleccionar imagen" onPress={seleccionarImagen} />

        {imagen && (
          <Image
            source={{ uri: imagen.uri }}
            style={{
              width: 200,
              height: 120,
              marginTop: 12,
              alignSelf: "center",
            }}
          />
        )}

        <View style={{ marginTop: 20 }}>
          <ThemedButton onPress={guardarTaller}>Guardar</ThemedButton>
        </View>
      </View>
    </ScrollView>
  );
}
