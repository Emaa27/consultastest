// app/(profesional)/turnos/page.tsx
"use client";

import React, { useState } from "react";
import { Plus } from "@/components/turnos/icons";
import WeekNavigation from "@/components/turnos/WeekNavigation";
import CalendarGrid from "@/components/turnos/CalendarGrid";
import TurnoModal from "@/components/turnos/TurnoModal";
import FiltrosModal from "@/components/turnos/FiltrosModal";
import { useTurnos } from "@/hooks/useTurnos";
import EstadosTurnosLegend from "@/components/turnos/EstadoTurnosLegend";
import { getStartOfWeek, addDays, formatWeekRangeLabel } from "@/utils/turnos";

type Filtros = {
  profesional_id: number | null;
  obra_social_id: number | null;
  mostrarHistorico: boolean;
};

export default function TurnosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getStartOfWeek(new Date()));
  const [filtros, setFiltros] = useState<Filtros>({
    profesional_id: null,
    obra_social_id: null,
    mostrarHistorico: false,
  });
  
  const { turnos, isLoadingTurnos, pacientes, profesionales, obrasSociales, refetchTurnos } = useTurnos();

  // Semana visible
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const weekRangeLabel = formatWeekRangeLabel(daysOfWeek);

  const goPrevWeek = () => setCurrentWeekStart((d) => addDays(d, -7));
  const goNextWeek = () => setCurrentWeekStart((d) => addDays(d, +7));
  const goTodayWeek = () => setCurrentWeekStart(getStartOfWeek(new Date()));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2e75d4] to-[#8ddee1] bg-clip-text text-transparent mb-3">
          Calendario de turnos
        </h1>
        <p className="text-gray-600 text-lg">
          Visualización de los turnos médicos del consultorio
        </p>
      </div>

      {/* Barra de navegación semanal */}
      <WeekNavigation
        weekRangeLabel={weekRangeLabel}
        onPrevWeek={goPrevWeek}
        onNextWeek={goNextWeek}
        onTodayWeek={goTodayWeek}
      />

      {/* Botones de acción */}
      <div className="flex gap-3 mb-6">
        <button
          className="px-6 py-3 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white rounded-lg 
                 hover:from-[#2e75d4] hover:to-[#8ddee1] shadow-lg transform transition-all duration-200 
                 hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Agregar Nuevo Turno
        </button>

        <button
          className="px-6 py-3 bg-white border-2 border-[#6596d8] text-[#6596d8] rounded-lg 
                 hover:bg-[#6596d8] hover:text-white shadow-lg transform transition-all duration-200 
                 hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
          onClick={() => setFiltrosOpen(true)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
          {(filtros.profesional_id || filtros.obra_social_id || filtros.mostrarHistorico) && (
            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {[filtros.profesional_id, filtros.obra_social_id, filtros.mostrarHistorico].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>
      <EstadosTurnosLegend />
      {/* Calendario */}
      {isLoadingTurnos ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6596d8] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando turnos...</p>
          </div>
        </div>
      ) : (
        <CalendarGrid
          daysOfWeek={daysOfWeek}
          turnos={turnos}
          filtros={filtros}
          onUpdate={refetchTurnos}
        />
      )}

      {/* Modal Turno */}
      <TurnoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pacientes={pacientes}
        profesionales={profesionales}
        onTurnoGuardado={refetchTurnos}
      />

      {/* Modal Filtros */}
      <FiltrosModal
        open={filtrosOpen}
        onOpenChange={setFiltrosOpen}
        filtros={filtros}
        onFiltrosChange={setFiltros}
        profesionales={profesionales}
        obrasSociales={obrasSociales}
      />
    </div>
  );
}