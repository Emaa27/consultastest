// components/turnos/CalendarGrid.tsx
"use client";

import React from "react";
import DayColumn from "@/components/turnos/DayColumn";
import { Turno } from "@/types/turnos";

type Filtros = {
  profesional_id: number | null;
  obra_social_id: number | null;
  mostrarHistorico: boolean;
};

interface CalendarGridProps {
  daysOfWeek: Date[];
  turnos: Turno[];
  filtros: Filtros;
  onUpdate?: () => void;
}

export default function CalendarGrid({
  daysOfWeek,
  turnos,
  filtros,
  onUpdate,
}: CalendarGridProps) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const toDate = (d: string | Date) => new Date(d);

  const turnosPorDia = (day: Date) =>
    turnos
      .filter((t) => {
        const inicio = toDate(t.inicio);

        // 1) el turno pertenece a la columna (mismo día)
        if (!sameDay(inicio, day)) return false;

        // 2) Filtro por profesional
        if (filtros.profesional_id && t.profesional_id !== filtros.profesional_id) {
          return false;
        }

        // 3) Filtro por obra social
        if (filtros.obra_social_id && t.obra_social_id !== filtros.obra_social_id) {
          return false;
        }

        // 4) si histórico está OFF → solo futuros respecto a "ahora"
        if (!filtros.mostrarHistorico) {
          // si es hoy, desde "ahora" en adelante; si es un día posterior, todos
          if (sameDay(day, now)) return inicio >= now;
          if (day > startOfToday) return true; // día futuro
          return false; // día pasado (no mostrar)
        }

        // 5) histórico ON → sin filtro temporal
        return true;
      })
      .sort(
        (a, b) =>
          new Date(a.inicio as any).getTime() -
          new Date(b.inicio as any).getTime()
      );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {daysOfWeek.map((day, idx) => {
        const isToday = sameDay(new Date(), day);
        const turnosDelDia = turnosPorDia(day);

        return (
          <DayColumn
            key={idx}
            day={day}
            turnos={turnosDelDia}
            isToday={isToday}
            onUpdate={onUpdate}
          />
        );
      })}
    </div>
  );
}
