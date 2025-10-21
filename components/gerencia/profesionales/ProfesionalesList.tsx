'use client';

import { useState, useEffect } from 'react';
import ProfesionalesEditFormComponent from './ProfesionalesEditForm';

interface Profesional {
  profesional_id: number;
  usuarios?: { 
    usuario_id: number;
    nombre: string; 
    apellido: string;
    email: string;
    telefono: string;
  };
  profesiones?: { nombre: string };
  matricula?: string;
  estado: string;
  profesion_id: number;
}

interface ProfesionalesListProps {
  filters: { estado: string; busqueda: string };
  refreshTrigger: number;
}

export function ProfesionalesListComponent({ filters, refreshTrigger }: ProfesionalesListProps) {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfesional, setEditingProfesional] = useState<Profesional | null>(null);

  useEffect(() => {
    const fetchProfesionales = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.estado !== 'todos') queryParams.append('estado', filters.estado);
        if (filters.busqueda) queryParams.append('busqueda', filters.busqueda);

        const res = await fetch(`/api/gerencia/profesionales?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = sortProfesionales(data);
          setProfesionales(sorted);
        }
      } catch (err) {
        console.error('Error fetching profesionales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesionales();
  }, [filters, refreshTrigger]);

  const sortProfesionales = (data: Profesional[]) => {
    return [...data].sort((a, b) => {
      const aApellido = a.usuarios?.apellido || '';
      const aNombre = a.usuarios?.nombre || '';
      const bApellido = b.usuarios?.apellido || '';
      const bNombre = b.usuarios?.nombre || '';
      
      const comparison = aApellido.localeCompare(bApellido, 'es', { sensitivity: 'base' });
      if (comparison === 0) {
        return aNombre.localeCompare(bNombre, 'es', { sensitivity: 'base' });
      }
      return comparison;
    });
  };

  const handleToggleEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/gerencia/profesionales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        setProfesionales((prev: Profesional[]) =>
          prev.map((prof: Profesional) =>
            prof.profesional_id === id ? { ...prof, estado: nuevoEstado } : prof
          )
        );
      }
    } catch (err) {
      console.error('Error updating estado:', err);
    }
  };

  const handleEditSuccess = () => {
    setEditingProfesional(null);
    const fetchProfesionales = async () => {
      try {
        const res = await fetch('/api/gerencia/profesionales');
        if (res.ok) {
          const data = await res.json();
          const sorted = sortProfesionales(data);
          setProfesionales(sorted);
        }
      } catch (err) {
        console.error('Error fetching profesionales:', err);
      }
    };
    fetchProfesionales();
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando profesionales...</div>;
  }

  return (
    <>
      {editingProfesional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ProfesionalesEditFormComponent
              profesional={editingProfesional as any}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingProfesional(null)}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Apellido</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Profesión</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Matrícula</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesionales.map((prof: Profesional) => (
              <tr key={prof.profesional_id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{prof.usuarios?.apellido}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{prof.usuarios?.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{prof.profesiones?.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{prof.matricula}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${prof.estado === 'activo' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {prof.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingProfesional(prof)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleEstado(prof.profesional_id, prof.estado === 'activo' ? 'inactivo' : 'activo')}
                      className={`font-medium ${prof.estado === 'activo' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                    >
                      {prof.estado === 'activo' ? 'Dar de baja' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}