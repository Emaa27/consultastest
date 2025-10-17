'use client';

import { useState, useEffect } from 'react';

interface Profesion {
  profesion_id: number;
  nombre: string;
}

interface ProfesionesListProps {
  filters: { busqueda: string };
  refreshTrigger: number;
}

export function ProfesionesListComponent({ filters, refreshTrigger }: ProfesionesListProps) {
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfesiones = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.busqueda) queryParams.append('busqueda', filters.busqueda);

        const res = await fetch(`/api/gerencia/profesiones?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          setProfesiones(data);
        }
      } catch (err) {
        console.error('Error fetching profesiones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesiones();
  }, [filters, refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta profesión?')) return;

    try {
      const res = await fetch(`/api/gerencia/profesiones/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProfesiones((prev: Profesion[]) => prev.filter((p: Profesion) => p.profesion_id !== id));
      }
    } catch (err) {
      console.error('Error deleting profesión:', err);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando profesiones...</div>;

  if (profesiones.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl">
        <p className="text-gray-500">No hay profesiones registradas</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {profesiones.map((prof: Profesion) => (
        <div key={prof.profesion_id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900">{prof.nombre}</h3>
          <p className="text-sm text-gray-500 mt-2">ID: {prof.profesion_id}</p>
          <button
            onClick={() => handleDelete(prof.profesion_id)}
            className="mt-4 text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}