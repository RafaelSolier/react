// src/pages/ServiciosClientePage.tsx
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { Search, Calendar, Star } from "lucide-react";
import { Navbar } from "@components/Navbar";
import Footer from "@components/Footer";
import Button from "@components/Button";
import { BuscarParams } from "@interfaces/servicio/BuscarParams";
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";
import { HorarioResponse } from "@interfaces/disponibilidades/HorarioResponse";
import {
  obtenerServiciosActivos,
  buscarServicios,
} from "@services/servicio/servicioService";
import {
  obtenerHorariosPorServicio,
} from "@services/disponibilidad/horarioService";

const ServiciosClientePage: React.FC = () => {
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);
  const [horariosMap, setHorariosMap] = useState<
    Record<number, HorarioResponse[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BuscarParams>({
    categoria: "",
    direccion: "",
    precioMin: "",
    precioMax: "",
    calificacionMin: "",
    page: 0,
    size: 10,
  });

  // 1) Carga inicial de servicios
  useEffect(() => {
    cargarActivos();
  }, []);

  // 2) Cada vez que 'servicios' cambia, carga sus horarios
  useEffect(() => {
    if (!servicios.length) return;
    (async () => {
      const map: Record<number, HorarioResponse[]> = {};
      await Promise.all(
        servicios.map(async (s) => {
          try {
            map[s.id] = await obtenerHorariosPorServicio(s.id);
          } catch (err) {
            map[s.id] = [];
            console.error(
              "No se pudieron cargar horarios para servicio",
              s.id,
              err
            );
          }
        })
      );
      setHorariosMap(map);
    })();
  }, [servicios]);

  async function cargarActivos() {
    setLoading(true);
    try {
      const data = await obtenerServiciosActivos();
      setServicios(data);
    } catch (err) {
      console.error("Error al cargar servicios activos:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((f) => ({
      ...f,
      [name]:
        name.startsWith("precio") ||
        name === "calificacionMin" ||
        name === "page" ||
        name === "size"
          ? Number(value)
          : value,
    }));
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await buscarServicios(filters);
      setServicios(results);
    } catch (err) {
      console.error("Error al buscar servicios:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar avatarUrl="#" userName="Usuario"/>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Servicios Disponibles
          </h1>
          {/* <Button message="Ver Todos" onClick={cargarActivos} /> */}
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <input
            name="categoria"
            placeholder="Categoría"
            value={filters.categoria}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          />
          {/* <input
            name="direccion"
            placeholder="Dirección"
            value={filters.direccion}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          /> */}
          <div className="flex space-x-2">
            <input
              name="precioMin"
              type="number"
              placeholder="Precio Min"
              value={filters.precioMin}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded"
            />
            <input
              name="precioMax"
              type="number"
              placeholder="Precio Max"
              value={filters.precioMax}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded"
            />
          </div>
          <div className="flex space-x-2">
            <input
              name="calificacionMin"
              type="number"
              placeholder="Calif. Min"
              value={filters.calificacionMin}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-1/2 flex items-center justify-center bg-indigo-600 px-4 py-2 text-white rounded hover:bg-indigo-700"
            >
              <Search className="w-5 h-5 mr-1" /> Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de servicios */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-500">Cargando servicios...</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Descripción</th>
                  <th className="px-6 py-3">Precio</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3">Horarios</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron servicios
                    </td>
                  </tr>
                ) : (
                  servicios.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-6 py-4">{s.nombre}</td>
                      <td className="px-6 py-4">{s.descripcion}</td>
                      <td className="px-6 py-4">S/ {s.precio.toFixed(2)}</td>
                      <td className="px-6 py-4">{s.categoria}</td>
                      <td className="px-6 py-4 space-y-1">
                        {(horariosMap[s.id] && horariosMap[s.id].length > 0) ? (
                          horariosMap[s.id].map((h) => (
                            <div key={h.id} className="text-sm">
                              {h.diaSemana} {h.horaInicio}-{h.horaFin}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400">Sin horarios</div>
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => console.log("Reservar", s.id)}
                          className="inline-flex items-center hover:text-indigo-600"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => console.log("Reseñar", s.id)}
                          className="inline-flex items-center hover:text-yellow-500"
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ServiciosClientePage;
