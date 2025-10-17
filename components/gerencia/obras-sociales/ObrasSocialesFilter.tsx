'use client';

import { useState } from 'react';

interface ObrasSocialesFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function ObrasSocialesFilterComponent({ onFilterChange }: ObrasSocialesFilterProps) {
  const [filters, setFilters] = useState({ 
    estado: 'todos', 
    busqueda: '' // Búsqueda unificada
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <select name="estado" value={filters.estado} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
        <option value="todos">Todos los estados</option>
        <option value="activa">Activas</option>
        <option value="inactiva">Inactivas</option>
      </select>

      <input
        type="text"
        name="busqueda"
        placeholder="Buscar por nombre..."
        value={filters.busqueda}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none flex-1 min-w-[300px]"
      />
    </div>
  );
}