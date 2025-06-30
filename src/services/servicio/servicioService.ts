import Api from "@services/api";
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";
import { ServicioRequest } from "@interfaces/servicio/ServicioRequest";

export async function crearServicio(
    proveedorId: number,
    servicio: ServicioRequest
): Promise<ServicioResponse> {
    const Apis = await Api.getInstance();
    const response = await Apis.post<ServicioRequest, ServicioResponse>(
        servicio,
        { url: `/api/proveedores/${proveedorId}/servicios` }
    );
    return response.data;
}

export async function actualizarServicio(
    servicioId: number,
    servicio: ServicioRequest
): Promise<void> {
    const Apis = await Api.getInstance();
    await Apis.put<ServicioRequest, void>(
        servicio,
        { url: `/api/servicios/${servicioId}` }
    );
}

export async function eliminarServicio(servicioId: number): Promise<void> {
    const Apis = await Api.getInstance();
    await Apis.delete({
        url: `/api/servicios/${servicioId}`,
    });
}

export async function obtenerServiciosProveedor(
    proveedorId: number
): Promise<ServicioResponse[]> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, ServicioResponse[]>({
        url: `/api/servicios/${proveedorId}/servicios`,
    });
    return response.data;
}

export async function cambiarEstadoServicio(
    servicioId: number,
    activo: boolean
): Promise<ServicioResponse> {
    const Apis = await Api.getInstance();
    const response = await Apis.patch<null, ServicioResponse>(
        null,
        { url: `/api/servicios/${servicioId}/estado?activo=${activo}` }
    );
    return response.data;
}