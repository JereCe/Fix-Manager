import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { getBaseImageUrl } from "@/presentation/theme/hooks/getBaseImageUrl";

interface TurnoDetalle {
  fecha: string;
  hora: string;
  tallerNombre: string;
  tallerUbicacion: string;
  descripcionTrabajo: string;
  imagenes: string[];
  estado: string;
}

const DetalleTurnoScreen = () => {
  const { id } = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const baseUrl = getBaseImageUrl();
  const [detalle, setDetalle] = useState<TurnoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [calificacion, setCalificacion] = useState<number | null>(null);
  const [calificado, setCalificado] = useState(false);
  const [imagenModal, setImagenModal] = useState<string | null>(null);
  const [animacion] = useState(new Animated.Value(1));

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const { data } = await fixManagerApi.get(`/turnos/${id}/detalle`);
        setDetalle(data);
      } catch (error) {
        console.error("Error al obtener detalle:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCalificacion = async () => {
      try {
        const { data } = await fixManagerApi.get(`/turnos/${id}/calificacion`);
        setCalificado(data.calificado);
        setCalificacion(data.puntuacion);
      } catch (error) {
        console.error("Error al verificar calificación:", error);
      }
    };

    fetchDetalle();
    fetchCalificacion();
  }, [id]);

  const enviarCalificacion = async (puntuacion: number) => {
    try {
      await fixManagerApi.put(
        `/turnos/${id}/calificar`,
        { puntuacion },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Animated.sequence([
        Animated.timing(animacion, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animacion, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setCalificado(true);
      setCalificacion(puntuacion);
    } catch (error) {
      console.error("Error al calificar turno:", error);
    }
  };

  if (loading || !detalle) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5CC6FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor, padding: 16 }}>
      <Stack.Screen options={{ title: "Detalle del Turno" }} />

      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <View style={{ gap: 4 }}>
          <ThemedText style={{ color: "white", fontSize: 20 }}>
            Fecha: {detalle.fecha} - Hora: {detalle.hora}
          </ThemedText>
          <ThemedText style={{ color: "white" }}>
            Taller: {detalle.tallerNombre}
          </ThemedText>
          <ThemedText style={{ color: "white" }}>
            Dirección: {detalle.tallerUbicacion}
          </ThemedText>
          <ThemedText style={{ color: "white" }}>Trabajo realizado:</ThemedText>
          <ThemedText style={{ color: "white" }}>
            {detalle.descripcionTrabajo}
          </ThemedText>
        </View>

        {detalle.imagenes.length > 0 && (
          <FlatList
            data={detalle.imagenes}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ marginTop: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setImagenModal(baseUrl + item)}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Image
                  source={{ uri: baseUrl + item }}
                  style={{ width: "100%", height: "100%", borderRadius: 8 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {imagenModal && (
        <Modal visible transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.9)",
              justifyContent: "center",
            }}
          >
            <Pressable onPress={() => setImagenModal(null)}>
              <Image
                source={{ uri: imagenModal }}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </Pressable>
          </View>
        </Modal>
      )}

      <View
        style={{
          backgroundColor: cardBackground,
          borderRadius: 16,
          padding: 16,
        }}
      >
        {calificado ? (
          <ThemedText style={{ color: "white", textAlign: "center" }}>
            Ya calificaste este turno con {calificacion} estrella(s).
          </ThemedText>
        ) : (
          <>
            <ThemedText style={{ color: "white", marginBottom: 8 }}>
              Calificar:
            </ThemedText>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => enviarCalificacion(star)}
                >
                  <Animated.View style={{ transform: [{ scale: animacion }] }}>
                    <Ionicons
                      name={
                        star <= (calificacion || 0) ? "star" : "star-outline"
                      }
                      size={32}
                      color="#FFD700"
                    />
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default DetalleTurnoScreen;
