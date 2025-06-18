export interface Taller {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  imagenLogo: string;
  promedioCalificacion: number;
  cantidadCalificaciones: number;
  ciudad: string;
  // Podés agregar un tipo para agenda si lo necesitás más adelante
  // agenda?: Agenda;
}
