import { Vehiculo } from "./Vehiculo";

export interface Turno {
  id: number;
  fecha: string; // ISO string, e.g. "2025-06-01"
  hora: string; // ISO string, e.g. "14:30:00"
  vehiculo: Vehiculo; // Usás la interfaz anterior
  disponibilidad: "DISPONIBLE" | "RESERVADO" | "NO_DISPONIBLE"; // según tu enum
  estado: "PENDIENTE" | "REALIZADO" | "CANCELADO"; // según tu enum
  descripcionTrabajo: string;
  imagenes: string[];
  calificacion: number | null;
}
