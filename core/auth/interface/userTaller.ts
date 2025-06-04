import { Taller } from "./Taller";

export interface UserTaller {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  taller?: Taller;
  rol?: string;
}
