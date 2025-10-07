// components/turnos/DayColumn.tsx
"use client";

import React from "react";
import TurnoCard from "@/components/turnos/TurnoCard";
import { Turno } from "@/types/turnos";

interface DayColumnProps {
  day: Date;
  turnos: Turno[];
  isToday: boolean;
  onUpdate?: () => void;
}

export default function DayColumn({ day, turnos, isToday, onUpdate }: DayColumnProps) {
  return (
    <div
      className={`border rounded-xl p-3 transition-all duration-200 ${
        isToday
          ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 shadow-md"
          : "bg-white border-gray-200 hover:shadow-sm"
      }`}
    >
      <div className="mb-3 pb-2 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-700">
          {day.toLocaleDateString("es-AR", { weekday: "short" }).toUpperCase()}
        </p>
        <p className="text-xs text-gray-500">
          {day.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
        </p>
      </div>

      <div className="space-y-2">
        {turnos.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-4">Sin turnos</p>
        ) : (
          turnos.map((turno) => (
            <TurnoCard key={turno.turno_id} turno={turno} onUpdate={onUpdate} />
          ))
        )}
      </div>
    </div>
  );
}