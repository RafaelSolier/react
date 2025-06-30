import Api from "@services/api";
import { ResenaResponse } from "@interfaces/resena/ResenaResponse";

export async function obtenerResenasPorServicio(
    servicioId: number
): Promise<ResenaResponse[]> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, ResenaResponse[]>({
        url: `/api/servicios/${servicioId}/resenas`,
    });
    return response.data;
}