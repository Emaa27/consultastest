'use client';

import React, { useState } from 'react';
import { PacientesListComponent } from '@/components/gerencia/pacientes/PacientesList';
import PacientesFilterComponent from '@/components/gerencia/pacientes/PacientesFilter';

export default function PacientesPage() {
  const [filters, setFilters] = useState({ estado: 'todos', obraSocial: '', busqueda: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <section className="min-h-screen lg:ml-20 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
          <p className="text-gray-600 mt-1">Administra el estado de los pacientes en el sistema</p>
        </div>

        <div className="mb-6">
          <PacientesFilterComponent onFilterChange={setFilters} />
        </div>

        <PacientesListComponent filters={filters} refreshTrigger={refreshTrigger} />
      </div>
    </section>
  );
}