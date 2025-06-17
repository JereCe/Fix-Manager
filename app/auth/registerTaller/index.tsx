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
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const RegisterTallerScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const [isPosting, setIsPosting] = useState(false);

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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onRegister = async () => {
    const { nombre, apellido, email, contrasenia } = form;

    if (!nombre || !apellido || !email || !contrasenia) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Correo electrónico inválido");
      return;
    }

    try {
      setIsPosting(true);
      await fixManagerApi.post("/talleres/registro", {
        nombre,
        apellido,
        email,
        contrasenia,
      });

      Alert.alert("Éxito", "Cuenta de taller creada correctamente");
      router.replace("/auth/loginTaller");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo crear la cuenta");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{
          paddingHorizontal: 40,
          paddingTop: 40,
          paddingBottom: 30,
        }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center", marginBottom: 30, marginTop: 50 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 152, height: 126 }}
          />
        </View>

        <ThemedText
          type="title"
          style={{ color: "#A5AAB1", marginBottom: 4, marginTop: 40 }}
        >
          Registro Taller
        </ThemedText>
        <ThemedText style={{ color: "#A5AAB1", marginBottom: 20 }}>
          Por favor completa los datos para continuar
        </ThemedText>

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

        <View style={{ marginTop: 20 }}>
          <ThemedButton
            icon="arrow-forward-outline"
            onPress={onRegister}
            disabled={isPosting}
          >
            Crear cuenta
          </ThemedButton>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <ThemedText style={{ color: "#A5AAB1" }}>
            ¿Ya tienes cuenta?
          </ThemedText>

          <ThemedLink href="/auth/loginTaller" style={{ marginHorizontal: 5 }}>
            Ingresar
          </ThemedLink>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterTallerScreen;
