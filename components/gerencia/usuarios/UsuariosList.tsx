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

export function UsuariosListComponent({ filters, refreshTrigger }: UsuariosListProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

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

  const sortUsuarios = (data: Usuario[]) => {
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
        const res = await fetch('/api/gerencia/usuarios');
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

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando usuarios...</div>;

  return (
    <>
      {editingUsuario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <UsuariosEditFormComponent
              usuario={editingUsuario}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingUsuario(null)}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">DNI</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user: Usuario) => (
              <tr key={user.usuario_id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.nombre} {user.apellido}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.dni || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.roles?.nombre}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.estado === 'activo' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingUsuario(user)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleEstado(user.usuario_id, user.estado === 'activo' ? 'inactivo' : 'activo')}
                      className={`font-medium ${user.estado === 'activo' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                    >
                      {user.estado === 'activo' ? 'Dar de baja' : 'Activar'}
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