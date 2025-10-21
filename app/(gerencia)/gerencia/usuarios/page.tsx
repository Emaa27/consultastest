'use client';

import React, { useState } from 'react';
import { UsuariosListComponent } from '@/components/gerencia/usuarios/UsuariosList';
import UsuariosFormComponent from '@/components/gerencia/usuarios/UsuariosForm';
import UsuariosFilterComponent from '@/components/gerencia/usuarios/UsuariosFilter';

export default function UsuariosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({ estado: 'todos', rol: '', busqueda: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <main className="p-6 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">Crea y administra cuentas de usuarios con roles</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Usuario
          </button>
        </div>

        <div className="mb-6">
          <UsuariosFilterComponent onFilterChange={setFilters} />
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                <h2 className="text-xl font-bold">Nuevo Usuario</h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <UsuariosFormComponent
                onSuccess={() => {
                  setIsFormOpen(false);
                  setRefreshTrigger(p => p + 1);
                }}
              />
            </div>
          </div>
        )}

        <UsuariosListComponent filters={filters} refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}