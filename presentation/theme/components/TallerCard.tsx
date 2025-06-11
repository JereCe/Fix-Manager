import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Taller } from "@/core/auth/interface/Taller";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState, useRef } from "react";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

export const TallerCard = ({
  taller,
  baseUrl,
  onToggleFavorito,
}: {
  taller: Taller;
  baseUrl: string;
  onToggleFavorito?: () => void;
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [esFavorito, setEsFavorito] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const { data } = await fixManagerApi.get(
          `/clientes/${user?.id}/favoritos`
        );
        const idsFavoritos = data.map((t: any) => t.id);
        setEsFavorito(idsFavoritos.includes(taller.id));
      } catch (error) {
        console.error("Error verificando favoritos:", error);
      }
    };

    verificarFavorito();
  }, [taller.id, user?.id]);

  const toggleFavorito = async () => {
    try {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      if (esFavorito) {
        await fixManagerApi.delete(
          `/clientes/${user?.id}/favoritos/${taller.id}`
        );
        setEsFavorito(false);
        onToggleFavorito?.();
      } else {
        await fixManagerApi.put(`/clientes/${user?.id}/favoritos/${taller.id}`);
        setEsFavorito(true);
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `${baseUrl}${taller.imagenLogo}` }}
        style={styles.image}
      />

      <Text style={styles.calificacion}>
        ⭐{" "}
        {taller.promedioCalificacion != null
          ? taller.promedioCalificacion.toFixed(1)
          : "Sin calificación"}
      </Text>

      <View style={styles.nombreYFavorito}>
        <Text style={styles.nombre}>{taller.nombre}</Text>
        <TouchableOpacity onPress={toggleFavorito}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={esFavorito ? "star" : "star-outline"}
              size={20}
              color={esFavorito ? "yellow" : "white"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Text style={styles.descripcion}>{taller.descripcion}</Text>
      <Text style={styles.ubicacion}>📍 {taller.ubicacion}</Text>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/taller/reservarTurno",
            params: { id: taller.id.toString() },
          })
        }
        style={styles.boton}
      >
        <Text style={{ color: "white" }}>Reservar Turno</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2E3C",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  calificacion: {
    color: "white",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 8,
    fontSize: 14,
  },
  nombreYFavorito: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  nombre: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    paddingRight: 10,
  },
  descripcion: {
    color: "white",
    marginVertical: 4,
  },
  ubicacion: {
    color: "#ccc",
    marginBottom: 10,
  },
  boton: {
    backgroundColor: "#5CC6FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
