export interface BuscarParams {
  categoria?: string;
  precioMin?: string | number;
  precioMax?: string | number;
  calificacionMin?: string | number;
  page?: number;
  size?: number;
}