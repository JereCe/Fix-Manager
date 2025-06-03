import { View, Image } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import MainActionButton from "@/presentation/theme/components/MainActionButton";

export default function HomeClienteScreen() {
  const backgroundColor = useThemeColor({}, "BackgroundBtn");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
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
        <MainActionButton
          icon="calendar-outline"
          label="Nuevo turno"
          //onPress={() => router.push("/nuevo-turno")}
        />
        <MainActionButton
          icon="calendar-number-outline"
          label="Mis turnos"
          //onPress={() => router.push("/mis-turnos")}
        />
        <MainActionButton
          icon="car-outline"
          label="Mis Autos"
          onPress={() => router.push("/(tabs-cliente)/(fix-manager)/vehiculos")}
        />
        <MainActionButton
          icon="star-outline"
          label="Favoritos"
          //onPress={() => router.push("/favoritos")}
        />
      </View>
    </View>
  );
}
