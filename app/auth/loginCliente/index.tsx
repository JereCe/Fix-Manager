import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
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

const LoginClienteScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const [isPosting, setIsPosting] = useState(false);
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Correo electrónico inválido.");
      return;
    }

    setIsPosting(true);
    const wasSuccessful = await login(email, password);
    setIsPosting(false);

    if (wasSuccessful) {
      router.replace("/(tabs-cliente)/(fix-manager)/(home-cliente)");
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrecta");
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
            style={{ width: 186, height: 159 }}
          />
        </View>

        <ThemedText
          type="title"
          style={{ color: "#A5AAB1", marginBottom: 4, marginTop: 60 }}
        >
          Ingresar
        </ThemedText>
        <ThemedText style={{ color: "#A5AAB1", marginBottom: 20 }}>
          Por favor ingrese para continuar
        </ThemedText>

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
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />

        <View style={{ marginTop: 20 }}>
          <ThemedButton
            icon="arrow-forward-outline"
            onPress={onLogin}
            disabled={isPosting}
          >
            Ingresar
          </ThemedButton>
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <ThemedLink
            href="/auth/loginTaller"
            style={{ color: "#5CC6FF", marginTop: 10 }}
          >
            ¿Sos un taller? Ingresar aquí
          </ThemedLink>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <ThemedText style={{ color: "#A5AAB1" }}>
            ¿No tienes cuenta?
          </ThemedText>

          <ThemedLink
            href="/auth/registerCliente"
            style={{ marginHorizontal: 5 }}
          >
            Crear cuenta
          </ThemedLink>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LoginClienteScreen;
