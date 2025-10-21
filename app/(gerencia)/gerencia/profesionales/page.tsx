'use client';

import React, { useState } from 'react';
import { ProfesionalesListComponent } from '@/components/gerencia/profesionales/ProfesionalesList';
import ProfesionalesFormComponent from '@/components/gerencia/profesionales/ProfesionalesForm';
import ProfesionalesFilterComponent from '@/components/gerencia/profesionales/ProfesionalesFilter';

export default function ProfesionalesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({ estado: 'todos', busqueda: '' }); // ← Cambiar aquí
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <main className="p-6 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
      <div className="w-full">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Profesionales</h1>
              <p className="text-gray-600 mt-1">Administra el personal médico de la clínica</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Profesional
            </button>
          </div>

          <ProfesionalesFilterComponent onFilterChange={setFilters} />
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold">Agregar Profesional</h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProfesionalesFormComponent onSuccess={() => {
                setIsFormOpen(false);
                setRefreshTrigger(prev => prev + 1);
              }} />
            </div>
          </div>
        )}

        <ProfesionalesListComponent filters={filters} refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}