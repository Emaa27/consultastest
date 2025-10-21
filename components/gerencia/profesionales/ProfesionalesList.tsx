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
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Cargando profesionales...</p>
      </div>
    );
  }

  if (profesionales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-gray-50 rounded-full mb-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron profesionales</h3>
        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <>
      {editingProfesional && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp border-2 border-green-100">
            <ProfesionalesEditFormComponent
              profesional={editingProfesional as any}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingProfesional(null)}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b-2 border-green-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Apellido
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Profesión
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profesionales.map((prof: Profesional, index: number) => (
                <tr 
                  key={prof.profesional_id} 
                  className="hover:bg-green-50/30 transition-colors duration-150 group"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInRow 0.3s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center font-bold text-emerald-700 shadow-sm group-hover:scale-110 transition-transform ring-2 ring-emerald-50">
                        {prof.usuarios?.apellido?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {prof.usuarios?.apellido}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {prof.usuarios?.nombre}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {prof.profesiones?.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      {prof.matricula}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                      prof.estado === 'activo' 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                        : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        prof.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {prof.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProfesional(prof)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg font-semibold text-sm hover:from-purple-100 hover:to-purple-200 hover:shadow-md transition-all border border-purple-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleEstado(
                          prof.profesional_id, 
                          prof.estado === 'activo' ? 'inactivo' : 'activo'
                        )}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all border ${
                          prof.estado === 'activo'
                            ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 border-orange-200'
                            : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 border-emerald-200'
                        }`}
                      >
                        {prof.estado === 'activo' ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Dar de baja
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Activar
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}