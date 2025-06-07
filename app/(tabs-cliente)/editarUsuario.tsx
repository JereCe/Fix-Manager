import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { Stack, router } from "expo-router";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

const EditarClienteScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuthStore();

  const isTaller = user?.rol === "TALLER";

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    email: "",
    contrasenia: "",
  });

  const [isPosting, setIsPosting] = useState(false);

  // precargar los datos del usuario
  useEffect(() => {
    if (!user) return;

    const endpoint = isTaller ? `/talleres/${user.id}` : `/clientes/${user.id}`;

    fixManagerApi
      .get(endpoint)
      .then(({ data }) => {
        setForm({
          nombre: data.nombre ?? "",
          apellido: data.apellido ?? "",
          documento: isTaller ? "" : (data.documento ?? ""),
          email: data.email ?? "",
          contrasenia: "",
        });
      })
      .catch(() => {
        Alert.alert("Error", "No se pudieron cargar los datos del usuario");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onUpdate = async () => {
    const { nombre, apellido, documento, email, contrasenia } = form;

    if (!nombre || !apellido || (!isTaller && !documento) || !email) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const datosParaEnviar: any = {
      nombre,
      apellido,
      email,
    };

    if (!isTaller) {
      datosParaEnviar.documento = documento;
    }

    if (contrasenia && contrasenia.trim().length > 0) {
      datosParaEnviar.contrasenia = contrasenia;
    }

    if (!user) {
      Alert.alert("Error", "No se encontró el usuario");
      return;
    }
    const endpoint = isTaller
      ? `/talleres/editar/${user.id}`
      : `/clientes/editar/${user.id}`;

    try {
      setIsPosting(true);

      await fixManagerApi.put(endpoint, datosParaEnviar);

      Alert.alert("Éxito", "Datos actualizados correctamente");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar el usuario");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Editar datos" }} />
      <ScrollView
        style={{
          paddingHorizontal: 40,
          backgroundColor: backgroundColor,
        }}
      >
        <View style={{ alignItems: "center", paddingTop: 50 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 152, height: 126 }}
          />
        </View>

        <View style={{ marginTop: 60 }}>
          <ThemedText type="title" style={{ color: "#A5AAB1" }}>
            Editar mis datos
          </ThemedText>
          <ThemedText style={{ color: "#A5AAB1" }}>
            Puedes modificar tus datos personales
          </ThemedText>
        </View>

        <View style={{ marginTop: 20 }}>
          <ThemedTextInput
            placeholder="Nombre"
            autoCapitalize="words"
            icon="person-outline"
            value={form.nombre}
            onChangeText={(value) => setForm({ ...form, nombre: value })}
          />

          <ThemedTextInput
            placeholder="Apellido"
            autoCapitalize="words"
            icon="person-outline"
            value={form.apellido}
            onChangeText={(value) => setForm({ ...form, apellido: value })}
          />

          {!isTaller && (
            <ThemedTextInput
              placeholder="Documento"
              keyboardType="numeric"
              icon="card-outline"
              value={form.documento}
              onChangeText={(value) => setForm({ ...form, documento: value })}
            />
          )}

          <ThemedTextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <ThemedTextInput
            placeholder="Contraseña (opcional)"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
            value={form.contrasenia}
            onChangeText={(value) => setForm({ ...form, contrasenia: value })}
          />

          <View style={{ marginVertical: 20 }}>
            <ThemedButton
              icon="checkmark-done-outline"
              onPress={onUpdate}
              disabled={isPosting}
            >
              Guardar cambios
            </ThemedButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditarClienteScreen;
