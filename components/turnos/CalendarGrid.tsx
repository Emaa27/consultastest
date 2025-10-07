// components/turnos/CalendarGrid.tsx
"use client";

import React from "react";
import DayColumn from "@/components/turnos/DayColumn";
import { Turno } from "@/types/turnos";

interface CalendarGridProps {
  daysOfWeek: Date[];
  turnos: Turno[];
  mostrarHistorico: boolean;
}

export default function CalendarGrid({
  daysOfWeek,
  turnos,
  mostrarHistorico,
}: CalendarGridProps) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // (Opcional) cuando Histórico está OFF, ocultar columnas de días pasados
  const visibleDays = mostrarHistorico
    ? daysOfWeek
    : daysOfWeek.filter((d) => d >= startOfToday || sameDay(d, startOfToday));

  const toDate = (d: string | Date) => new Date(d);

  const turnosPorDia = (day: Date) =>
    turnos
      .filter((t) => {
        const inicio = toDate(t.inicio);

        // 1) el turno pertenece a la columna (mismo día)
        if (!sameDay(inicio, day)) return false;

        // 2) si histórico está OFF → solo futuros respecto a "ahora"
        if (!mostrarHistorico) {
          // si es hoy, desde "ahora" en adelante; si es un día posterior, todos
          if (sameDay(day, now)) return inicio >= now;
          if (day > startOfToday) return true; // día futuro
          return false; // día pasado (no mostrar)
        }

        // 3) histórico ON → sin filtro temporal
        return true;
      })
      .sort(
        (a, b) =>
          new Date(a.inicio as any).getTime() -
          new Date(b.inicio as any).getTime()
      );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {visibleDays.map((day, idx) => {
        const isToday = sameDay(new Date(), day);
        const turnosDelDia = turnosPorDia(day);

        return (
          <DayColumn
            key={idx}
            day={day}
            turnos={turnosDelDia}
            isToday={isToday}
          />
        );
      })}
    </div>
  );
}
