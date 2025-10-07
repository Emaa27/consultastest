// app/(profesional)/turnos/page.tsx
"use client";

import React, { useState } from "react";
import { Plus } from "@/components/turnos/icons";
import WeekNavigation from "@/components/turnos/WeekNavigation";
import CalendarGrid from "@/components/turnos/CalendarGrid";
import TurnoModal from "@/components/turnos/TurnoModal";
import { useTurnos } from "@/hooks/useTurnos";
import { getStartOfWeek, addDays, formatWeekRangeLabel } from "@/utils/turnos";

export default function TurnosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getStartOfWeek(new Date()));
  
  const { turnos, isLoadingTurnos, pacientes, profesionales, refetchTurnos } = useTurnos();

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

      {/* Botón agregar turno */}
      <button
        className="px-6 py-3 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white rounded-lg 
               hover:from-[#2e75d4] hover:to-[#8ddee1] shadow-lg transform transition-all duration-200 
               hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-5 h-5" />
        Agregar Nuevo Turno
      </button>
      
      {/* Checkbox Mostrar Histórico */}
      <div
        className="inline-flex items-center gap-2 px-3 py-2 mb-6 
                  bg-gradient-to-r from-[#f8fafc] to-[#eef6fb] 
                  border border-gray-200 rounded-lg shadow-sm 
                  hover:shadow-md transition-all duration-200"
      >
        <input
          id="mostrarHistorico"
          type="checkbox"
          checked={mostrarHistorico}
          onChange={(e) => setMostrarHistorico(e.target.checked)}
          className="h-4 w-4 text-[#6596d8] border-gray-300 rounded focus:ring-[#6596d8] cursor-pointer"
        />
        <label
          htmlFor="mostrarHistorico"
          className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
        >
          Histórico
        </label>
      </div>

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
          mostrarHistorico={mostrarHistorico}
        />
      )}

      {/* Modal */}
      <TurnoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pacientes={pacientes}
        profesionales={profesionales}
        onTurnoGuardado={refetchTurnos}
      />
    </div>
  );
}