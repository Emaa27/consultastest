'use client';

import { useState, useEffect } from 'react';

interface ObraSocial {
  obra_social_id: number;
  nombre: string;
  estado: string;
}

interface ObrasSocialesListProps {
  filters: { estado: string; busqueda: string };
  refreshTrigger: number;
}

export function ObrasSocialesListComponent({ filters, refreshTrigger }: ObrasSocialesListProps) {
  const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>([]);
  const [loading, setLoading] = useState(true);

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

  const sortObrasSociales = (data: ObraSocial[]) => {
    return [...data].sort((a, b) => 
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );
  };

  const handleToggleEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/gerencia/obras-sociales-admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
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

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando obras sociales...</div>;

  if (obrasSociales.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl">
        <p className="text-gray-500">No hay obras sociales registradas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {obrasSociales.map((os: ObraSocial) => (
            <tr key={os.obra_social_id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{os.nombre}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${os.estado === 'activa' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {os.estado === 'activa' ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => handleToggleEstado(os.obra_social_id, os.estado === 'activa' ? 'inactiva' : 'activa')}
                  className={`font-medium ${os.estado === 'activa' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                >
                  {os.estado === 'activa' ? 'Dar de baja' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}