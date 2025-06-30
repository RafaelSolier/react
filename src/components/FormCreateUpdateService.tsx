// src/components/ServiceForm.tsx
import React, { useState } from "react";
import { Save, X, Plus, Edit } from "lucide-react";

// Tipos de datos
interface ServiceData {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
}

interface ServiceFormProps {
  mode: 'create' | 'update';
  onSubmit: (data: ServiceData) => void;
  onCancel?: () => void;
  initialData?: Partial<ServiceData>;
  isLoading?: boolean;
}

// Categorías disponibles
const CATEGORIAS = [
  { value: "PLOMERIA", label: "Plomería" },
  { value: "ELECTRICIDAD", label: "Electricidad" },
  { value: "LIMPIEZA", label: "Limpieza" },
  { value: "JARDINERIA", label: "Jardinería" },
  { value: "PINTURA", label: "Pintura" },
  { value: "CARPINTERIA", label: "Carpintería" },
  { value: "MECANICA", label: "Mecánica" },
  { value: "OTROS", label: "Otros" },
];

export const ServiceForm: React.FC<ServiceFormProps> = ({
  mode,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ServiceData>({
    nombre: initialData?.nombre || "",
    descripcion: initialData?.descripcion || "",
    precio: initialData?.precio || 0,
    categoria: initialData?.categoria || "",
  });

  const [errors, setErrors] = useState<Partial<ServiceData>>({});

  // Configuración basada en el modo
  const config = {
    create: {
      title: "Crear Nuevo Servicio",
      subtitle: "Complete la información del servicio que desea ofrecer",
      buttonText: "Guardar Servicio",
      loadingText: "Guardando...",
      icon: Plus,
    },
    update: {
      title: "Actualizar Servicio",
      subtitle: "Modifique la información de su servicio",
      buttonText: "Actualizar Servicio",
      loadingText: "Actualizando...",
      icon: Edit,
    },
  };

  const currentConfig = config[mode];
  const IconComponent = currentConfig.icon;

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Partial<ServiceData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del servicio es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (formData.precio <= 0) {
      //newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.categoria) {
      newErrors.categoria = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo del envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Manejo de cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "precio" ? parseFloat(value) || 0 : value,
    }));

    // Limpiar error del campo si existe
    if (errors[name as keyof ServiceData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-full ${mode === 'create' ? 'bg-green-100' : 'bg-blue-100'}`}>
            <IconComponent className={`w-6 h-6 ${mode === 'create' ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentConfig.title}
          </h2>
        </div>
        <p className="text-gray-600">
          {currentConfig.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre del servicio */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Servicio *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Limpieza de Ventanas"
            disabled={isLoading}
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            value={formData.descripcion}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.descripcion ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describa detalladamente el servicio que ofrece..."
            disabled={isLoading}
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
            Precio (S/.) *
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.precio ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.categoria ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          >
            <option value="">Seleccione una categoría</option>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria.value} value={categoria.value}>
                {categoria.label}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
              mode === 'create' 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? currentConfig.loadingText : currentConfig.buttonText}</span>
          </button>
        </div>
      </form>
    </div>
  );
};