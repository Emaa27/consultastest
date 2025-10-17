'use client';

import { useState, useEffect } from 'react';

interface Rol {
  rol_id: number;
  nombre: string;
}

interface UsuariosFormProps {
  onSuccess: () => void;
}

export default function UsuariosFormComponent({ onSuccess }: UsuariosFormProps) {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    contrasena: '',
    rol_id: '1',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/gerencia/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rol_id: parseInt(formData.rol_id),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear usuario');
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">Nuevo Usuario</h2>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={formData.apellido}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="tel"
        name="telefono"
        placeholder="Teléfono (opcional)"
        value={formData.telefono}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="password"
        name="contrasena"
        placeholder="Contraseña"
        value={formData.contrasena}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <select
        name="rol_id"
        value={formData.rol_id}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      >
        <option value="">Seleccionar rol</option>
        {roles.map(rol => (
          <option key={rol.rol_id} value={rol.rol_id}>
            {rol.nombre}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Usuario'}
      </button>
    </form>
  );
}