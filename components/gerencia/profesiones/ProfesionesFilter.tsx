'use client';

import { useState } from 'react';

interface ProfesionesFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function ProfesionesFilterComponent({ onFilterChange }: ProfesionesFilterProps) {
  const [busqueda, setBusqueda] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    onFilterChange({ busqueda: e.target.value });
  };

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none min-w-[300px]"
      />
    </div>
  );
}