'use client';

import React, { useState } from 'react';
// Importamos el ícono de Heroicons que queremos usar
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; 

import { PacientesListComponent } from '@/components/gerencia/pacientes/PacientesList';
import PacientesFilterComponent from '@/components/gerencia/pacientes/PacientesFilter';

export default function PacientesPage() {
  const [filters, setFilters] = useState({ estado: 'todos', obraSocial: '', busqueda: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 1. Reemplazamos la función manual del ícono con un componente de Heroicons
  const PatientIcon = (props: any) => (
    <ClipboardDocumentListIcon {...props} />
  );

  // El ícono de refrescar también lo reemplazaremos para mejor calidad
  const RefreshIcon = (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.926 8.926 0 0120 12a9 9 0 11-8-9.982" />
    </svg>
  );

  return (
    <main className="relative p-8 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/40 min-h-screen overflow-hidden">
      {/* Elementos decorativos flotantes (Consistencia) */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-100/40 rounded-full blur-2xl"></div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        
        {/* Barra decorativa estilo navbar (Consistencia) */}
        <div className="h-16 bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#86efac] rounded-2xl shadow-xl mb-6 flex items-center px-8 relative overflow-hidden">
          {/* Patrón decorativo */}
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute left-0 bottom-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
          
          {/* Contenido decorativo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-white/80 rounded-full"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
              <div className="w-3 h-3 bg-white/40 rounded-full"></div>
            </div>
            <div className="h-8 w-px bg-white/30 mx-2"></div>
            {/* Usamos el nuevo PatientIcon, que ahora es un componente Heroicon */}
            <PatientIcon className="w-6 h-6 text-white/90" /> 
            <span className="text-white/90 font-bold text-lg">Gestión de Pacientes</span>
          </div>
        </div>

        {/* Header con fondo, título y filtros (Consistencia) */}
        <div className="relative mb-8 p-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-100">
          {/* Patrón de fondo decorativo para el header */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96">
              <svg viewBox="0 0 200 200" className="w-full h-full text-green-600">
                <defs>
                  <pattern id="patient-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="currentColor"/>
                    <path d="M15 15 L25 25 M15 25 L25 15" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="200" height="200" fill="url(#patient-pattern)"/>
              </svg>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {/* Icono decorativo */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md">
                  {/* Usamos el nuevo PatientIcon aquí también */}
                  <PatientIcon className="w-8 h-8 text-green-600" /> 
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pacientes</h1>
                  <p className="text-gray-600 text-lg">Administra el estado de los pacientes en el sistema</p>
                </div>
              </div>
              
              {/* Botón de Acción Principal (Refrescar) */}
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg"
              >
                {/* Usamos el nuevo RefreshIcon (Heroicon) */}
                <RefreshIcon className="w-5 h-5" />
                Refrescar Lista
              </button>
            </div>

            {/* Componente de Filtro */}
            <PacientesFilterComponent onFilterChange={setFilters} />
          </div>
        </div>

        {/* Lista con diseño mejorado */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <PacientesListComponent filters={filters} refreshTrigger={refreshTrigger} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}