import { FlatList, View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { VehiculoCard } from "@/presentation/theme/components/VehiculoCard";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Vehiculo } from "@/core/auth/interface/Vehiculo";

const VehiculosScreen = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
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
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5CC6FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor, padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>
        Mis Vehículos
      </ThemedText>
      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VehiculoCard
            marca={item.marca}
            modelo={item.modelo}
            patente={item.patente}
          />
        )}
      />
    </View>
  );
};

export default VehiculosScreen;
