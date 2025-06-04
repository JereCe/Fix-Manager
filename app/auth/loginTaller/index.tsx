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
  KeyboardAvoidingView,
  ScrollView,
  View,
  Image,
} from "react-native";
import { authLoginTaller } from "@/core/auth/actions/auth-actions"; // ✅

const LoginTallerScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const [isPosting, setIsPosting] = useState(false);

  const { changeStatus } = useAuthStore(); // ✅ usamos changeStatus directamente

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    const { email, password } = form;

    if (!email || !password) return;

    setIsPosting(true);

    const resp = await authLoginTaller(email, password); // ✅ login de taller

    setIsPosting(false);

    if (resp) {
      await changeStatus(resp.token, resp.user);
      router.replace("/(tabs-cliente)/(fix-manager)/(home-cliente)"); // ✅ ruta de taller
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrecta");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 40, backgroundColor }}>
        <View style={{ alignItems: "center", paddingTop: 70 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 186, height: 159 }}
          />
        </View>

        <View style={{ marginTop: 80 }}>
          <ThemedText type="title" style={{ color: "#A5AAB1" }}>
            Ingresar como Taller
          </ThemedText>
          <ThemedText style={{ color: "#A5AAB1" }}>
            Por favor ingrese para continuar
          </ThemedText>
        </View>

        <View style={{ marginTop: 20 }}>
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

          <View style={{ marginVertical: 10 }} />

          <ThemedButton
            icon="arrow-forward-outline"
            onPress={onLogin}
            disabled={isPosting}
          >
            Ingresar
          </ThemedButton>

          <View style={{ marginVertical: 40 }} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <ThemedText style={{ color: "#A5AAB1" }}>
              ¿No tienes cuenta?
            </ThemedText>

            <ThemedLink
              href="/auth/registerTaller" // ✅ si tenés uno, si no cambialo
              style={{ marginHorizontal: 5 }}
            >
              Crear cuenta
            </ThemedLink>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginTallerScreen;
