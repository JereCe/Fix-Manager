import { Vehiculo } from "./Vehiculo";
import { Turno } from "./Turno";

export interface UserCliente {
  id: number;
  email: string;
  contrasenia?: string;
  nombre: string;
  apellido?: string;
  documento?: string;
  vehiculos?: Vehiculo[];
  turnos?: Turno[];
  rol?: string;
}
