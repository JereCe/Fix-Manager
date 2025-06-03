import { useEffect, useState } from "react";
import { fixManagerApi } from "@/core/auth/api/fixManagerApi";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Vehiculo } from "@/core/auth/interface/Vehiculo";

export const useVehiculos = () => {
  const userId = useAuthStore.getState().user?.id;
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarVehiculos = async () => {
    try {
      const { data } = await fixManagerApi.get(`/vehiculos/usuario/${userId}`);
      setVehiculos(data);
    } catch (error) {
      console.error("Error al cargar vehículos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) cargarVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    vehiculos,
    loading,
    reload: cargarVehiculos,
  };
};
