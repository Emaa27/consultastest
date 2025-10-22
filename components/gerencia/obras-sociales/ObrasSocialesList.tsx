'use client';

import { useState, useEffect } from 'react';
// Importamos los íconos necesarios de Heroicons
import { BuildingOffice2Icon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'; 

interface ObraSocial {
  obra_social_id: number;
  nombre: string;
  estado: string; // 'activa' o 'inactiva'
}

interface ObrasSocialesListProps {
  filters: { estado: string; busqueda: string };
  refreshTrigger: number;
}

export function ObrasSocialesListComponent({ filters, refreshTrigger }: ObrasSocialesListProps) {
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  const [loading, setLoading] = useState(true);

  const sortObrasSociales = (data: ObraSocial[]) => {
    return [...data].sort((a, b) => 
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );
  };

  useEffect(() => {
    const fetchObrasSociales = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.estado !== 'todos') queryParams.append('estado', filters.estado);
        if (filters.busqueda) queryParams.append('busqueda', filters.busqueda);

        const res = await fetch(`/api/gerencia/obras-sociales-admin?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = sortObrasSociales(data);
          setObrasSociales(sorted);
        }
      } catch (err) {
        console.error('Error fetching obras sociales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchObrasSociales();
  }, [filters, refreshTrigger]);

  const handleToggleEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/gerencia/obras-sociales-admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        // Optimistic UI update
        setObrasSociales((prev: ObraSocial[]) =>
          prev.map((os: ObraSocial) =>
            os.obra_social_id === id ? { ...os, estado: nuevoEstado } : os
          )
        );
      }
    } catch (err) {
      console.error('Error updating estado:', err);
    }
  };

  // 1. Estilo para el estado de Carga (Spinner animado)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BuildingOffice2Icon className="w-8 h-8 text-green-600" /> 
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Cargando obras sociales...</p>
      </div>
    );
  }
  
  // 2. Estilo para el estado de Lista Vacía (No hay datos)
  if (obrasSociales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-gray-50 rounded-full mb-4">
          <BuildingOffice2Icon className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron Obras Sociales</h3>
        <p className="text-gray-500">Puedes crear una nueva o ajustar el filtro de búsqueda.</p>
      </div>
    );
  }

  // 3. Renderizado de la Tabla Estilizada
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {/* Estilo del thead con gradiente y borde */}
          <tr className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b-2 border-green-100">
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-1/3">
              Nombre de la Obra Social
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-1/4">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-1/4">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {obrasSociales.map((os: ObraSocial, index: number) => (
            <tr 
              key={os.obra_social_id} 
              className="hover:bg-green-50/30 transition-colors duration-150 group"
              style={{ 
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInRow 0.3s ease-out forwards',
                opacity: 0
              }}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {/* Icono decorativo de Obra Social (puede ser un ícono o un círculo de color) */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-lg flex items-center justify-center font-bold text-blue-700 shadow-sm group-hover:scale-110 transition-transform ring-2 ring-blue-400">
                    <BuildingOffice2Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {os.nombre}
                  </span>
                </div>
              </td>
              {/* Estado como Badge con gradiente condicional */}
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                  os.estado === 'activa' 
                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                    : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    os.estado === 'activa' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {os.estado === 'activa' ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td className="px-6 py-4">
                {/* Botón Toggle Estado con estilo Naranja/Esmeralda */}
                <button
                  onClick={() => handleToggleEstado(
                    os.obra_social_id, 
                    os.estado === 'activa' ? 'inactiva' : 'activa'
                  )}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all border ${
                    os.estado === 'activa'
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 border-orange-200'
                      : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 border-emerald-200'
                  }`}
                >
                  {os.estado === 'activa' ? (
                    <>
                      <XCircleIcon className="w-4 h-4" />
                      Dar de baja
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Activar
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Animación global para la fila, si no está definida en el layout */}
      <style jsx global>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}