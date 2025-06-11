import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { Stack } from "expo-router";
import { TallerCard } from "@/presentation/theme/components/TallerCard";
import { getBaseImageUrl } from "@/presentation/theme/hooks/getBaseImageUrl";
import { Taller } from "@/core/auth/interface/Taller";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

export default function ListarFavoritosScreen() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState("nombre");
  const baseUrl = getBaseImageUrl() ?? "";
  const backgroundColor = useThemeColor({}, "background");
  const { user } = useAuthStore();

  const fetchFavoritos = async () => {
    try {
      const { data } = await fixManagerApi.get(
        `/clientes/${user?.id}/favoritos`
      );
      setTalleres(data);
    } catch (e) {
      console.error("Error cargando favoritos:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const ordenarTalleres = () => {
    return [...talleres].sort((a, b) => {
      if (orden === "nombre") {
        return a.nombre.localeCompare(b.nombre);
      } else if (orden === "calificacion") {
        return b.promedioCalificacion - a.promedioCalificacion;
      }
      return 0;
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color="#5CC6FF " />
      </View>
    );
  }

  return (
    <View style={{ padding: 16, flex: 1, backgroundColor: backgroundColor }}>
      <Stack.Screen options={{ title: "Mis Talleres Favoritos" }} />

      <View style={styles.filtrosContainer}>
        <Text style={styles.ordenarTexto}>Ordenar por:</Text>
        <TouchableOpacity onPress={() => setOrden("nombre")}>
          <Text
            style={[
              styles.filtroBoton,
              orden === "nombre" && styles.filtroActivo,
            ]}
          >
            Nombre
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrden("calificacion")}>
          <Text
            style={[
              styles.filtroBoton,
              orden === "calificacion" && styles.filtroActivo,
            ]}
          >
            Calificación
          </Text>
        </TouchableOpacity>
      </View>

      {talleres.length === 0 ? (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          No tenés talleres favoritos aún.
        </Text>
      ) : (
        <FlatList
          data={ordenarTalleres()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TallerCard
              taller={item}
              baseUrl={baseUrl}
              onToggleFavorito={fetchFavoritos}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filtrosContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  ordenarTexto: {
    color: "white",
    fontWeight: "bold",
  },
  filtroBoton: {
    color: "#5CC6FF",
    fontWeight: "bold",
  },
  filtroActivo: {
    textDecorationLine: "underline",
  },
});
