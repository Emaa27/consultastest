'use client';

import { useState, useEffect } from 'react';

interface Rol {
  rol_id: number;
  nombre: string;
}

interface UsuarioData {
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string; // ← Cambiado a opcional
  dni?: string; // ← Cambiado a opcional
  rol_id: number;
}

interface UsuariosEditFormProps {
  usuario: UsuarioData;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UsuariosEditFormComponent({ 
  usuario, 
  onSuccess, 
  onCancel 
}: UsuariosEditFormProps) {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono || '',
    dni: usuario.dni || '',
    rol_id: usuario.rol_id.toString(),
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/gerencia/roles');
        if (res.ok) {
          const data = await res.json();
          setRoles(data);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) return 'El nombre es obligatorio';
    if (!formData.apellido.trim()) return 'El apellido es obligatorio';
    if (!formData.email.trim()) return 'El email es obligatorio';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Email inválido';
    if (!formData.telefono.trim()) return 'El teléfono es obligatorio';
    if (!formData.dni.trim()) return 'El DNI es obligatorio';
    if (!formData.dni.match(/^\d{7,8}$/)) return 'DNI inválido (debe tener 7 u 8 dígitos)';
    if (!formData.rol_id) return 'Debe seleccionar un rol';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/gerencia/usuarios/${usuario.usuario_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          email: formData.email.trim(),
          telefono: formData.telefono.trim(),
          dni: formData.dni.trim(),
          rol_id: parseInt(formData.rol_id),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al actualizar usuario');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        name="nombre"
        placeholder="Nombre *"
        value={formData.nombre}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="text"
        name="apellido"
        placeholder="Apellido *"
        value={formData.apellido}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="email"
        name="email"
        placeholder="Email *"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="tel"
        name="telefono"
        placeholder="Teléfono *"
        value={formData.telefono}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="text"
        name="dni"
        placeholder="DNI (7 u 8 dígitos) *"
        value={formData.dni}
        onChange={handleChange}
        required
        pattern="\d{7,8}"
        maxLength={8}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <select
        name="rol_id"
        value={formData.rol_id}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      >
        <option value="">Seleccionar rol *</option>
        {roles.map(rol => (
          <option key={rol.rol_id} value={rol.rol_id}>
            {rol.nombre}
          </option>
        ))}
      </select>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}