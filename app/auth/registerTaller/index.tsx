import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
} from "react-native";

const RegisterTallerScreen = () => {
  const backgroundColor = useThemeColor({}, "background");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasenia: "",
    nombreTaller: "",
    ubicacion: "",
    descripcion: "",
    imagenLogo: "",
  });

  const [isPosting, setIsPosting] = useState(false);

  const onRegister = async () => {
    const {
      nombre,
      apellido,
      email,
      contrasenia,
      nombreTaller,
      ubicacion,
      descripcion,
      imagenLogo,
    } = form;

    if (
      !nombre ||
      !apellido ||
      !email ||
      !contrasenia ||
      !nombreTaller ||
      !ubicacion ||
      !descripcion
    ) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
      return;
    }

    try {
      setIsPosting(true);
      await fixManagerApi.post("/talleres/registro", {
        nombre,
        apellido,
        email,
        contrasenia,
        taller: {
          nombre: nombreTaller,
          ubicacion,
          descripcion,
          imagenLogo,
        },
      });

      Alert.alert("Éxito", "Cuenta de taller creada correctamente");
      router.replace("/auth/loginTaller"); // Redirige al login de taller
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo crear la cuenta");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 40, backgroundColor }}>
        <View style={{ alignItems: "center", paddingTop: 50 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 152, height: 126 }}
          />
        </View>

        <View style={{ marginTop: 60 }}>
          <ThemedText type="title" style={{ color: "#A5AAB1" }}>
            Registro Taller
          </ThemedText>
          <ThemedText style={{ color: "#A5AAB1" }}>
            Por favor completa los datos para continuar
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

          <ThemedTextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <ThemedTextInput
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
            value={form.contrasenia}
            onChangeText={(value) => setForm({ ...form, contrasenia: value })}
          />

          <View style={{ marginVertical: 10 }} />
          <ThemedButton
            icon="arrow-forward-outline"
            onPress={onRegister}
            disabled={isPosting}
          >
            Crear cuenta
          </ThemedButton>

          <View style={{ marginVertical: 30 }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <ThemedText style={{ color: "#A5AAB1" }}>
              ¿Ya tienes cuenta?
            </ThemedText>

            <ThemedLink
              href="/auth/loginTaller"
              style={{ marginHorizontal: 5 }}
            >
              Ingresar
            </ThemedLink>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterTallerScreen;
