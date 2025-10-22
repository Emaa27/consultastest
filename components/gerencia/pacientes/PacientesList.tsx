'use client';

import { useState, useEffect } from 'react';
// Importamos un ícono de Heroicons para el spinner y el estado vacío
import { ClipboardDocumentListIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; 

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

  const sortPacientes = (data: Paciente[]) => {
    return [...data].sort((a, b) => {
      const comparison = a.apellido.localeCompare(b.apellido, 'es', { sensitivity: 'base' });
      if (comparison === 0) {
        return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
      }
      return comparison;
    });
  };

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

  // 1. Estilo para el estado de Carga (Spinner animado)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Usamos ArrowPathIcon o ClipboardDocumentListIcon, para reflejar el proceso */}
            <ArrowPathIcon className="w-8 h-8 text-green-600" /> 
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Cargando pacientes...</p>
      </div>
    );
  }
  
  // 2. Estilo para el estado de Lista Vacía (No hay datos)
  if (pacientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-gray-50 rounded-full mb-4">
          <ClipboardDocumentListIcon className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron pacientes</h3>
        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  // 3. Estilo de la tabla y sus filas
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {/* Estilo del thead con gradiente y borde */}
          <tr className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b-2 border-green-100">
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Apellido
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Documento
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Obra Social
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Contacto
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
          {pacientes.map((pac: Paciente, index: number) => (
            <tr 
              key={pac.paciente_id} 
              className="hover:bg-green-50/30 transition-colors duration-150 group"
              style={{ 
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInRow 0.3s ease-out forwards',
                opacity: 0
              }}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar estilizado con tonos violeta/índigo (para diferenciarse de Usuarios y Profesionales) */}
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-fuchsia-200 rounded-full flex items-center justify-center font-bold text-violet-700 shadow-sm group-hover:scale-110 transition-transform ring-2 ring-violet-400">
                    {pac.apellido?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {pac.apellido}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {pac.nombre}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {pac.documento || '-'}
              </td>
              {/* Obra Social como Badge */}
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {pac.obras_sociales?.nombre || 'Particular'}
                </span>
              </td>
              {/* Email/Teléfono */}
              <td className="px-6 py-4 text-sm text-slate-600">
                {pac.email || pac.telefono || '-'}
              </td>
              {/* Estado como Badge con gradiente condicional */}
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                  pac.estado === 'activo' 
                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                    : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    pac.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {pac.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {/* Botón Toggle Estado con estilo Naranja/Esmeralda */}
                  <button
                    onClick={() => handleToggleEstado(
                      pac.paciente_id, 
                      pac.estado === 'activo' ? 'inactivo' : 'activo'
                    )}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all border ${
                      pac.estado === 'activo'
                        ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 border-orange-200'
                        : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 border-emerald-200'
                    }`}
                  >
                    {pac.estado === 'activo' ? (
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
                  {/* Si hubiera un botón de "Ver Historial" o "Editar", iría aquí con un estilo secundario */}
                  {/* <button className="text-gray-500 hover:text-gray-900">Historial</button> */}
                </div>
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