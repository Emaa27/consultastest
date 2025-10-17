'use client';

import { useState, useEffect } from 'react';

interface Paciente {
  paciente_id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  documento?: string;
  estado: string;
  obras_sociales?: { nombre: string };
}

interface PacientesListProps {
  filters: { estado: string; obraSocial: string; busqueda: string };
  refreshTrigger: number;
}

export function PacientesListComponent({ filters, refreshTrigger }: PacientesListProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.estado !== 'todos') queryParams.append('estado', filters.estado);
        if (filters.obraSocial) queryParams.append('obraSocial', filters.obraSocial);
        if (filters.busqueda) queryParams.append('busqueda', filters.busqueda);
        const res = await fetch(`/api/gerencia/pacientes?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = sortPacientes(data);
          setPacientes(sorted);
        }
      } catch (err) {
        console.error('Error fetching pacientes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [filters, refreshTrigger]);

  const sortPacientes = (data: Paciente[]) => {
    return [...data].sort((a, b) => {
      const comparison = a.apellido.localeCompare(b.apellido, 'es', { sensitivity: 'base' });
      if (comparison === 0) {
        return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
      }
      return comparison;
    });
  };

  const handleToggleEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/gerencia/pacientes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        setPacientes((prev: Paciente[]) =>
          prev.map((p: Paciente) => (p.paciente_id === id ? { ...p, estado: nuevoEstado } : p))
        );
      }
    } catch (err) {
      console.error('Error updating estado:', err);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando pacientes...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Documento</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Obra Social</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((pac: Paciente) => (
            <tr key={pac.paciente_id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{pac.nombre} {pac.apellido}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{pac.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{pac.documento || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{pac.obras_sociales?.nombre}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${pac.estado === 'activo' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {pac.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <button  onClick={() => handleToggleEstado(pac.paciente_id, pac.estado === 'activo' ? 'inactivo' : 'activo')}
                className={`font-medium ${pac.estado === 'activo' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}>
                  {pac.estado === 'activo' ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
