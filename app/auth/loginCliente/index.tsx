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
  ScrollView,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

const LoginScreen = () => {
  const backgroundColor = useThemeColor({}, "background");

  const [isPosting, setIsPosting] = useState(false);
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {
    const { email, password } = form;

    if (email.length === 0 || password.length === 0) return;

    setIsPosting(true);
    const wasSuccessful = await login(email, password);
    setIsPosting(false);

    if (wasSuccessful) {
      router.replace("/(tabs-cliente)/(fix-manager)/(home-cliente)");
      return;
    }

    Alert.alert("Error", "Usuario o contraseña incorrecta");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={{ flex: 1, backgroundColor: backgroundColor }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{ flex: 1, justifyContent: "center", paddingHorizontal: 40 }}
        >
          <View style={{ alignItems: "center", paddingTop: 70 }}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 186, height: 159 }}
            />
          </View>

          <View style={{ marginTop: 80 }}>
            <ThemedText type="title" style={{ color: "#A5AAB1" }}>
              Ingresar
            </ThemedText>
            <ThemedText style={{ color: "#A5AAB1" }}>
              Por favor ingrese para continuar
            </ThemedText>
          </View>

          <View style={{ marginTop: 20 }}>
            <ThemedTextInput
              placeholder="Correo electronico"
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
              ingresar
            </ThemedButton>

            <ThemedButton
              icon="arrow-forward-outline"
              onPress={() => router.replace("/auth/loginTaller")}
            >
              Ingreso Taller
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
                href="/auth/registerCliente"
                style={{ marginHorizontal: 5 }}
              >
                Crear cuenta
              </ThemedLink>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
