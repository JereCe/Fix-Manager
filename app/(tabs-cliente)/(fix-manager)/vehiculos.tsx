import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useCallback, useState } from "react";
import { VehiculoCard } from "@/presentation/theme/components/VehiculoCard";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Vehiculo } from "@/core/auth/interface/Vehiculo";
import { Stack, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const VehiculosScreen = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchVehiculos = async () => {
        setLoading(true);
        try {
          const { data } = await fixManagerApi.get(
            `/vehiculos/usuario/${user?.id}`
          );
          setVehiculos(data);
        } catch (error) {
          console.log("Error cargando vehículos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchVehiculos();
    }, [user?.id])
  );

  const handleEliminarVehiculo = async (id: number) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que deseas eliminar este vehículo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await fixManagerApi.delete(`/vehiculos/eliminar/${id}`);
              setVehiculos((prev) =>
                prev.filter((vehiculo) => vehiculo.id !== id)
              );
            } catch (error) {
              console.log("Error eliminando vehículo:", error);
              Alert.alert("Error", "No se pudo eliminar el vehículo");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5CC6FF" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Mis Vehículos" }} />

      <View style={{ flex: 1, backgroundColor }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
          <FlatList
            data={vehiculos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <VehiculoCard
                marca={item.marca}
                modelo={item.modelo}
                patente={item.patente}
                anio={item.anio ?? 0}
                onEditar={() =>
                  router.push({
                    pathname:
                      "/(tabs-cliente)/(fix-manager)/vehiculos/editar/[id]",
                    params: { id: item.id.toString() },
                  })
                }
                onHistorial={() =>
                  router.push({
                    pathname:
                      "/(tabs-cliente)/(fix-manager)/vehiculos/historialVehiculoScreen",
                    params: { id: item.id.toString() },
                  })
                }
                onEliminar={() => handleEliminarVehiculo(item.id)}
              />
            )}
          />
        </View>

        {/* Botón flotante */}
        <TouchableOpacity
          onPress={() =>
            router.push("/(tabs-cliente)/(fix-manager)/vehiculos/nuevo")
          }
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            backgroundColor: "#5CC6FF",
            borderRadius: 8,
            padding: 16,

            // Sombras para iOS
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,

            // Sombra para Android
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default VehiculosScreen;
