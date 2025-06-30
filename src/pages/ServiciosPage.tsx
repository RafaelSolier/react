// src/pages/MisServiciosPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus,} from 'lucide-react';
import ServiciosTable from "@components/servicios/ServiciosTable.tsx";

interface ServicioResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    estado?: "ACTIVO" | "INACTIVO";
    cantidadReservas?: number;
}

const MisServiciosPage: React.FC = () => {
    const [servicios, setServicios] = useState<ServicioResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            // Simulamos datos
            const mockServicios: ServicioResponse[] = [
                {
                    id: 1,
                    nombre: "Desarrollo de Apps",
                    descripcion: "Desarrollo de aplicaciones móviles para Android e iOS",
                    precio: 300,
                    categoria: "TECNOLOGIA",
                    estado: "ACTIVO",
                    cantidadReservas: 12
                },
                {
                    id: 2,
                    nombre: "Consultoría SEO",
                    descripcion: "Optimización de sitios web para motores de búsqueda",
                    precio: 150,
                    categoria: "MARKETING",
                    estado: "ACTIVO",
                    cantidadReservas: 8
                }
            ];

            setServicios(mockServicios);
            setLoading(false);

            // TODO: Implementar llamada real al API
            // const Api = await Api.getInstance();
            // const response = await Api.get("/proveedores/{id}/servicios");
            // setServicios(response.data);
        } catch (error) {
            console.error("Error al cargar servicios:", error);
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        console.log('Editar servicio:', id);
        // TODO: Implementar navegación a página de edición
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
            try {
                // TODO: Implementar eliminación real
                // const Api = await Api.getInstance();
                // await Api.delete(`/servicios/${id}`);

                // Simulamos la eliminación
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
        // TODO: Implementar navegación o modal
    };

    const handleViewReviews = (id: number) => {
        console.log('Ver reseñas del servicio:', id);
        // TODO: Implementar navegación o modal
    };

    const handleNewService = () => {
        console.log('Crear nuevo servicio');
        // TODO: Implementar navegación o modal
    };

    const getCategoriaStyles = (categoria: string) => {
        switch (categoria.toUpperCase()) {
            case 'TECNOLOGIA':
                return 'bg-purple-100 text-purple-800';
            case 'MARKETING':
                return 'bg-blue-100 text-blue-800';
            case 'LIMPIEZA':
                return 'bg-green-100 text-green-800';
            case 'PLOMERIA':
                return 'bg-yellow-100 text-yellow-800';
            case 'ELECTRICISTA':
                return 'bg-orange-100 text-orange-800';
            case 'CARPINTERIA':
                return 'bg-amber-100 text-amber-800';
            case 'PINTURA':
                return 'bg-pink-100 text-pink-800';
            case 'JARDINERIA':
                return 'bg-teal-100 text-teal-800';
            case 'CUIDADOS':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                <ServiciosTable servicios={servicios} onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    onViewSchedule={handleViewSchedule}
                                                    onViewReviews={handleViewReviews} />
            </div>
        </div>
    );
};

export default MisServiciosPage;