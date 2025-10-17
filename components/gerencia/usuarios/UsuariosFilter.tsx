'use client';

import { useState, useEffect } from 'react';

interface Rol {
  rol_id: number;
  nombre: string;
}

interface UsuariosFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function UsuariosFilterComponent({ onFilterChange }: UsuariosFilterProps) {
  const [filters, setFilters] = useState({ 
    estado: 'todos', 
    rol: '',
    busqueda: '' // Búsqueda unificada
  });
  const [roles, setRoles] = useState<Rol[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <select name="estado" value={filters.estado} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
        <option value="todos">Todos los estados</option>
        <option value="activo">Activos</option>
        <option value="inactivo">Inactivos</option>
      </select>

      <select name="rol" value={filters.rol} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
        <option value="">Todos los roles</option>
        {roles.map((rol: Rol) => (
          <option key={rol.rol_id} value={rol.rol_id}>
            {rol.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="busqueda"
        placeholder="Buscar por nombre, apellido o DNI..."
        value={filters.busqueda}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none flex-1 min-w-[300px]"
      />
    </div>
  );
}