
import React from 'react';
import CategoriaBadge from './CategoriaBadge';
import {ServicioResponse} from "@interfaces/servicio/ServicioResponse.ts";
import { Edit2, Clock, Star, Trash2 } from 'lucide-react';

interface ServicioRowProps {
    servicio: ServicioResponse;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onViewSchedule: (id: number) => void;
    onViewReviews: (id: number) => void;
}

const ServicioRow: React.FC<ServicioRowProps> = ({
                                                     servicio,
                                                     onEdit,
                                                     onDelete,
                                                     onViewSchedule,
                                                     onViewReviews
                                                 }) => {
    return (
        <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {servicio.nombre}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                        {servicio.descripcion}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    ${servicio.precio}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <CategoriaBadge categoria={servicio.categoria} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-semibold ${
                    servicio.estado === 'ACTIVO' || !servicio.estado
                        ? 'text-green-600'
                        : 'text-gray-500'
                }`}>
                    {servicio.estado === 'ACTIVO' || !servicio.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="text-sm text-gray-900 font-medium">
          {servicio.cantidadReservas || 0}
        </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center space-x-3">
                    <button
                        onClick={() => onEdit(servicio.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                        title="Editar servicio"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewSchedule(servicio.id)}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 rounded hover:bg-yellow-50"
                        title="Ver horarios"
                    >
                        <Clock className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewReviews(servicio.id)}
                        className="text-purple-600 hover:text-purple-800 transition-colors p-1 rounded hover:bg-purple-50"
                        title="Ver reseñas"
                    >
                        <Star className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(servicio.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                        title="Eliminar servicio"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ServicioRow;