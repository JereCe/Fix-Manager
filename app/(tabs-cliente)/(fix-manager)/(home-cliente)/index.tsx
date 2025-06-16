import { useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import MainActionButton from "@/presentation/theme/components/MainActionButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuthStore();
  const isTaller = user?.rol === "TALLER";

  const [checkingTaller, setCheckingTaller] = useState(false);

  const handleMiTallerPress = async () => {
    if (!user) return;
    setCheckingTaller(true);
    try {
      const { data } = await fixManagerApi.get(`/talleres/${user.id}/taller`);
      if (data) {
        router.push("/(tabs-cliente)/(fix-manager)/taller");
      } else {
        router.push("/(tabs-cliente)/(fix-manager)/taller/nuevoTaller");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      router.push("/(tabs-cliente)/(fix-manager)/taller/nuevoTaller");
    } finally {
      setCheckingTaller(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: "center",
        paddingTop: 60,
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 186, height: 159, marginBottom: 20 }}
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {isTaller ? (
          <>
            <MainActionButton
              icon="construct-outline"
              label="Mis turnos"
              onPress={() => router.push("/taller/turnosProximos")}
            />
            <MainActionButton
              icon="clipboard-outline"
              label="Mi taller"
              onPress={handleMiTallerPress}
            />
          </>
        ) : (
          <>
            <MainActionButton
              icon="calendar-outline"
              label="Nuevo turno"
              onPress={() =>
                router.push(
                  "/(tabs-cliente)/(fix-manager)/taller/ListarTalleresScreen"
                )
              }
            />
            <MainActionButton
              icon="calendar-number-outline"
              label="Mis turnos"
              onPress={() =>
                router.push("/(tabs-cliente)/(fix-manager)/taller/misTurnos")
              }
            />
            <MainActionButton
              icon="car-outline"
              label="Mis Autos"
              onPress={() =>
                router.push("/(tabs-cliente)/(fix-manager)/vehiculos")
              }
            />
            <MainActionButton
              icon="heart-outline"
              label="Favoritos"
              onPress={() =>
                router.push(
                  "/(tabs-cliente)/(fix-manager)/taller/ListarFavoritosScreen"
                )
              }
            />
          </>
        )}

        {checkingTaller && (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="large"
            color="#759aad"
          />
        )}
      </View>
    </View>
  );
}
