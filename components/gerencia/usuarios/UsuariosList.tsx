'use client';

import { useState, useEffect } from 'react';
import UsuariosEditFormComponent from './UsuariosEditForm';

interface Usuario {
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  dni?: string;
  estado: string;
  rol_id: number;
  roles?: { nombre: string };
}

interface UsuariosListProps {
  filters: { estado: string; rol: string; busqueda: string };
  refreshTrigger: number;
}

// Icono para la sección de Usuarios (persona genérica)
const UserIcon = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export function UsuariosListComponent({ filters, refreshTrigger }: UsuariosListProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  const sortUsuarios = (data: Usuario[]) => {
    return [...data].sort((a, b) => {
      const comparison = a.apellido.localeCompare(b.apellido, 'es', { sensitivity: 'base' });
      if (comparison === 0) {
        return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
      }
      return comparison;
    });
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.estado !== 'todos') queryParams.append('estado', filters.estado);
        if (filters.rol) queryParams.append('rol', filters.rol);
        if (filters.busqueda) queryParams.append('busqueda', filters.busqueda);

        const res = await fetch(`/api/gerencia/usuarios?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = sortUsuarios(data);
          setUsuarios(sorted);
        }
      } catch (err) {
        console.error('Error fetching usuarios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [filters, refreshTrigger]);

  const handleToggleEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/gerencia/usuarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        setUsuarios((prev: Usuario[]) =>
          prev.map((u: Usuario) => (u.usuario_id === id ? { ...u, estado: nuevoEstado } : u))
        );
      }
    } catch (err) {
      console.error('Error updating estado:', err);
    }
  };

  const handleEditSuccess = () => {
    setEditingUsuario(null);
    const fetchUsuarios = async () => {
      try {
        // Mejorar: re-fetch con filtros actuales, no solo la lista completa
        const queryParams = new URLSearchParams();
        if (filters.estado !== 'todos') queryParams.append('estado', filters.estado);
        if (filters.rol) queryParams.append('rol', filters.rol);
        if (filters.busqueda) queryParams.append('busqueda', filters.busqueda);
        
        const res = await fetch(`/api/gerencia/usuarios?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = sortUsuarios(data);
          setUsuarios(sorted);
        }
      } catch (err) {
        console.error('Error fetching usuarios:', err);
      }
    };
    fetchUsuarios();
  };

  // 1. Estilo para el estado de Carga (Spinner animado)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Cargando usuarios...</p>
      </div>
    );
  }
  
  // 2. Estilo para el estado de Lista Vacía (No hay datos)
  if (usuarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-gray-50 rounded-full mb-4">
          <UserIcon className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron usuarios</h3>
        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <>
      {/* 3. Modal de Edición (con estilos y animaciones) */}
      {editingUsuario && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp border-2 border-green-100">
            {/* Header del modal con diseño mejorado */}
            <div className="relative flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <UserIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
                </div>
                <button
                  onClick={() => setEditingUsuario(null)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

            <UsuariosEditFormComponent
              usuario={editingUsuario}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingUsuario(null)}
            />
          </div>
        </div>
      )}

      {/* 4. Estilo de la tabla y sus filas */}
      <div className="overflow-hidden">
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
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Rol
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
              {usuarios.map((user: Usuario, index: number) => (
                // Estilo de la fila con hover y animación de entrada
                <tr 
                  key={user.usuario_id} 
                  className="hover:bg-green-50/30 transition-colors duration-150 group"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInRow 0.3s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar estilizado */}
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-full flex items-center justify-center font-bold text-indigo-700 shadow-sm group-hover:scale-110 transition-transform ring-2 ring-indigo-50">
                        {user.apellido?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {user.apellido}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.email}
                  </td>
                  {/* Rol como Badge */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {user.roles?.nombre || 'Sin Rol'}
                    </span>
                  </td>
                  {/* Estado como Badge con gradiente condicional */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                      user.estado === 'activo' 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                        : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        user.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {/* Botón Editar con estilo Púrpura */}
                      <button
                        onClick={() => setEditingUsuario(user)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg font-semibold text-sm hover:from-purple-100 hover:to-purple-200 hover:shadow-md transition-all border border-purple-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      {/* Botón Toggle Estado con estilo Naranja/Esmeralda */}
                      <button
                        onClick={() => handleToggleEstado(
                          user.usuario_id, 
                          user.estado === 'activo' ? 'inactivo' : 'activo'
                        )}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition-all border ${
                          user.estado === 'activo'
                            ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 border-orange-200'
                            : 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 border-emerald-200'
                        }`}
                      >
                        {user.estado === 'activo' ? (
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

      {/* 5. Replicar las animaciones globales si no están en el componente padre */}
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
