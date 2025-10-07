// components/turnos/DayColumn.tsx
"use client";

import React from "react";
import TurnoCard from "@/components/turnos/TurnoCard";
import { Turno } from "@/types/turnos";

interface DayColumnProps {
  day: Date;
  turnos: Turno[];
  isToday: boolean;
}

export default function DayColumn({ day, turnos, isToday }: DayColumnProps) {
  return (
    <div
      className={`border rounded-xl p-3 transition-all duration-200 ${
        isToday
          ? "bg-gradient-to-br from-[#6596d8]/10 to-[#b5e4e6]/10 border-[#6596d8] shadow-lg"
          : "bg-white hover:shadow-md border-gray-200"
      }`}
    >
      <div className="mb-3 text-center">
        <h3 className={`font-bold ${isToday ? "text-[#6596d8]" : "text-gray-700"}`}>
          {day.toLocaleDateString("es-AR", { weekday: "short" })}
        </h3>
        <p className={`text-2xl font-bold ${isToday ? "text-[#6596d8]" : "text-gray-800"}`}>
          {day.getDate()}
        </p>
        <p className="text-xs text-gray-500">
          {day.toLocaleDateString("es-AR", { month: "short" })}
        </p>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {turnos.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-4">Sin turnos</p>
        ) : (
          turnos.map((turno) => (
            <TurnoCard key={turno.turno_id} turno={turno} />
          ))
        )}
      </div>
    </div>
  );
}