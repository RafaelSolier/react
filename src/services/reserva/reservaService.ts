import Api from "@services/api";
//import { ReservaRequest, } from "@interfaces/reserva/ReservaRequest";
import { ReservaResponse } from "@interfaces/reserva/RerservaResponse";
export async function obtenerReservasProveedor(
    proveedorId: number
): Promise<ReservaResponse[]> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, ReservaResponse[]>({
        url: `/api/proveedores/${proveedorId}/reservas`,
    });
    return response.data;
}

export async function aceptarReserva(reservaId: number): Promise<void> {
  const Apis = await Api.getInstance();
  // <- PASAMOS null COMO BODY para que use PATCH /url sin payload
  await Apis.patch<null, null>(
    null,
    { url: `/api/reservas/${reservaId}/aceptar` }
  );
}

export async function completarReserva(reservaId: number): Promise<void> {
  const Apis = await Api.getInstance();
  await Apis.patch<null, null>(
    null,
    { url: `/api/reservas/${reservaId}/completar` }
  );
}