// src/pages/ServiciosPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ServiciosTable from "@components/servicios/ServiciosTable";
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";
import { useAuthContext } from "@contexts/AuthContext";
import {
    obtenerServiciosProveedor,
    eliminarServicio,
    cambiarEstadoServicio
} from "@services/servicio/servicioService";
import { obtenerResenasPorServicio } from "@services/resena/resenaService";

const ServiciosPage: React.FC = () => {
    const [servicios, setServicios] = useState<ServicioResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuthContext();

    useEffect(() => {
        fetchServicios();
    }, [userId]);

    const fetchServicios = async () => {
        try {
            if (userId) {
                const data = await obtenerServiciosProveedor(userId);
                setServicios(data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar servicios:", error);
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        console.log('Editar servicio:', id);
        // TODO: Implementar navegación a página de edición o modal
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
            try {
                await eliminarServicio(id);
                // Actualizar la lista local
                setServicios(servicios.filter(s => s.id !== id));
                alert("Servicio eliminado exitosamente");
            } catch (error) {
                console.error("Error al eliminar servicio:", error);
                alert("Error al eliminar el servicio");
            }
        }
    };

    const handleViewSchedule = (id: number) => {
        console.log('Ver horarios del servicio:', id);
        // TODO: Implementar navegación o modal para ver horarios
    };

    const handleViewReviews = async (id: number) => {
        try {
            const resenas = await obtenerResenasPorServicio(id);
            console.log('Reseñas del servicio:', resenas);
            // TODO: Mostrar reseñas en un modal o navegación
        } catch (error) {
            console.error("Error al obtener reseñas:", error);
        }
    };

    const handleNewService = () => {
        console.log('Crear nuevo servicio');
        // TODO: Implementar navegación o modal para crear servicio
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await cambiarEstadoServicio(id, !currentStatus);
            // Actualizar el estado local
            setServicios(servicios.map(s =>
                s.id === id ? { ...s, activo: !currentStatus } : s
            ));
        } catch (error) {
            console.error("Error al cambiar estado del servicio:", error);
            alert("Error al cambiar el estado del servicio");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Cargando servicios...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Mis Servicios
                        </h1>
                        <button
                            onClick={handleNewService}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nuevo Servicio
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ServiciosTable
                    servicios={servicios}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewSchedule={handleViewSchedule}
                    onViewReviews={handleViewReviews}
                    onToggleStatus={handleToggleStatus}
                />
            </div>
        </div>
    );
};

export default ServiciosPage;