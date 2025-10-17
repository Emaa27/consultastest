'use client';

import { useState, useEffect } from 'react';

interface ObraSocial {
  obra_social_id: number;
  nombre: string;
}

interface PacientesFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function PacientesFilterComponent({ onFilterChange }: PacientesFilterProps) {
  const [filters, setFilters] = useState({ 
    estado: 'todos', 
    obraSocial: '',
    busqueda: ''
  });
  const [obras, setObras] = useState<ObraSocial[]>([]);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch('/api/gerencia/obras-sociales');
        if (res.ok) {
          const data = await res.json();
          setObras(data);
        }
      } catch (err) {
        console.error('Error fetching obras sociales:', err);
      }
    };
    fetchObras();
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

      <select name="obraSocial" value={filters.obraSocial} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
        <option value="">Todas las obras sociales</option>
        {obras.map((obra: ObraSocial) => (
          <option key={obra.obra_social_id} value={obra.obra_social_id}>
            {obra.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="busqueda"
        placeholder="Buscar por nombre, apellido o documento..."
        value={filters.busqueda}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none flex-1 min-w-[300px]"
      />
    </div>
  );
}