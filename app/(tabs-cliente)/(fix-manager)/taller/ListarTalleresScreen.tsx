import { useState, useCallback } from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { Stack, useFocusEffect } from "expo-router";
import { TallerCard } from "@/presentation/theme/components/TallerCard";
import { getBaseImageUrl } from "@/presentation/theme/hooks/getBaseImageUrl";
import { Taller } from "@/core/auth/interface/Taller";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Picker } from "@react-native-picker/picker";

const tiposReparacion = [
  "MECANICA_GENERAL",
  "ELECTRICIDAD",
  "AIRE_ACONDICIONADO",
  "NEUMATICOS",
  "CHAPA_PINTURA",
];

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function ListarTalleresScreen() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState("nombre");
  const [ciudad, setCiudad] = useState<string | undefined>();
  const [tipo, setTipo] = useState<string | undefined>();
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const baseUrl = getBaseImageUrl() ?? "";
  const backgroundColor = useThemeColor({}, "background");

  const fetchTalleres = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (ciudad) params.ciudad = ciudad;
      if (tipo) params.tipo = tipo;

      const { data } = await fixManagerApi.get("/talleres/filtrar", {
        params,
      });
      setTalleres(data);

      const ciudades = [
        ...new Set(data.map((t: Taller) => t.ciudad).filter(Boolean)),
      ];
      setCiudadesDisponibles(ciudades as string[]);
    } catch (e) {
      console.error("Error cargando talleres:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTalleres();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ciudad, tipo])
  );

  const ordenarTalleres = () => {
    return [...talleres].sort((a, b) => {
      if (orden === "nombre") {
        return a.nombre.localeCompare(b.nombre);
      } else if (orden === "calificacion") {
        return (b.promedioCalificacion ?? 0) - (a.promedioCalificacion ?? 0);
      }
      return 0;
    });
  };

  const limpiarFiltros = () => {
    setCiudad(undefined);
    setTipo(undefined);
  };

  const toggleMostrarFiltros = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMostrarFiltros((prev) => !prev);
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
      <Stack.Screen options={{ title: "Talleres Disponibles" }} />

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

      <TouchableOpacity
        style={styles.botonMostrarFiltros}
        onPress={toggleMostrarFiltros}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
        </Text>
      </TouchableOpacity>

      {mostrarFiltros && (
        <View style={styles.pickersContainer}>
          <Text style={{ color: "white" }}>Filtrar por ciudad:</Text>
          <Picker
            selectedValue={ciudad}
            onValueChange={(value) => setCiudad(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todas" value={undefined} />
            {ciudadesDisponibles.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>

          <Text style={{ color: "white" }}>
            Filtrar por tipo de reparación:
          </Text>
          <Picker
            selectedValue={tipo}
            onValueChange={(value) => setTipo(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos" value={undefined} />
            {tiposReparacion.map((t) => (
              <Picker.Item key={t} label={t.replace("_", " ")} value={t} />
            ))}
          </Picker>

          <TouchableOpacity
            style={styles.botonMostrarFiltros}
            onPress={limpiarFiltros}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Limpiar filtros
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={ordenarTalleres()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TallerCard taller={item} baseUrl={baseUrl} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  botonMostrarFiltros: {
    backgroundColor: "#2A3A4B",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  pickersContainer: {
    marginBottom: 16,
  },
  picker: {
    color: "white",
    backgroundColor: "#2A3A4B",
    marginBottom: 12,
  },
});
