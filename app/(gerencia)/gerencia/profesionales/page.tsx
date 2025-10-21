'use client';

import React, { useState } from 'react';
import { ProfesionalesListComponent } from '@/components/gerencia/profesionales/ProfesionalesList';
import ProfesionalesFormComponent from '@/components/gerencia/profesionales/ProfesionalesForm';
import ProfesionalesFilterComponent from '@/components/gerencia/profesionales/ProfesionalesFilter';

export default function ProfesionalesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({ estado: 'todos', busqueda: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <main className="relative p-8 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/40 min-h-screen overflow-hidden">
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-100/40 rounded-full blur-2xl"></div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        {/* Barra decorativa estilo navbar */}
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
            <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-white/90 font-bold text-lg">Gestión de Profesionales</span>
          </div>
        </div>

        {/* Header con fondo */}
        <div className="relative mb-8 p-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-100">
          {/* Patrón de fondo decorativo */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96">
              <svg viewBox="0 0 200 200" className="w-full h-full text-green-600">
                <defs>
                  <pattern id="medical-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="2" fill="currentColor"/>
                    <path d="M20 10 L20 30 M10 20 L30 20" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="200" height="200" fill="url(#medical-pattern)"/>
              </svg>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {/* Icono decorativo */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Profesionales</h1>
                  <p className="text-gray-600 text-lg">Administra el personal médico de la clínica</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Profesional
              </button>
            </div>

            <ProfesionalesFilterComponent onFilterChange={setFilters} />
          </div>
        </div>

        {/* Modal mejorado */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp border-2 border-green-100">
              {/* Header del modal con diseño mejorado */}
              <div className="relative flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Agregar Profesional</h2>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <ProfesionalesFormComponent onSuccess={() => {
                setIsFormOpen(false);
                setRefreshTrigger(prev => prev + 1);
              }} />
            </div>
          </div>
        )}

        {/* Lista con diseño mejorado */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <ProfesionalesListComponent filters={filters} refreshTrigger={refreshTrigger} />
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
