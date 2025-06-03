import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import { KeyboardAvoidingView, ScrollView, View, Image } from "react-native";

const RegisterClienteScreen = () => {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        style={{
          paddingHorizontal: 40,
          backgroundColor: backgroundColor,
        }}
      >
        <View style={{ alignItems: "center", paddingTop: 50 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{
              width: 152,
              height: 126,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 60,
          }}
        >
          <ThemedText type="title" style={{ color: "#A5AAB1" }}>
            Crear cuenta
          </ThemedText>
          <ThemedText style={{ color: "#A5AAB1" }}>
            Por favor crea una cuneta para continuar
          </ThemedText>
        </View>

        <View style={{ marginTop: 20 }}>
          <ThemedTextInput
            placeholder="Nombre"
            autoCapitalize="words"
            icon="person-outline"
          />

          <ThemedTextInput
            placeholder="Apellido"
            autoCapitalize="words"
            icon="mail-outline"
          />
          <ThemedTextInput
            placeholder="Documento"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />
          <ThemedTextInput
            placeholder="Correo electronico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <ThemedTextInput
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
          />
          <View
            style={{
              marginVertical: 10,
            }}
          />
          <ThemedButton icon="arrow-forward-outline">Crear cuenta</ThemedButton>
          <View
            style={{
              marginVertical: 30,
            }}
          />

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
              href="/auth/loginCliente"
              style={{
                marginHorizontal: 5,
              }}
            >
              Ingresar
            </ThemedLink>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterClienteScreen;
